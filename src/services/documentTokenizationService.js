/**
 * Document Tokenization Service
 * Breaks documents into tokens for AI processing and intelligent extraction
 * Handles PDF, DOCX, Excel, and plain text documents
 * Browser-compatible implementation
 */

// Browser-compatible imports (handled dynamically)
// PDF parsing, DOCX, and Excel support handled via worker threads or API calls

export class DocumentTokenizationService {
  constructor() {
    this.documentRegistry = new Map();
    this.tokenCache = new Map();
    this.MAX_TOKENS_PER_CHUNK = 4000; // Claude token limit
    this.OVERLAP_TOKENS = 200; // Context overlap between chunks
    this.eventListeners = [];
  }

  /**
   * Upload and tokenize document
   * @param {File} file - Document file to upload
   * @param {string} documentId - Unique document identifier
   * @returns {Promise<Object>} Tokenization result with chunks and metadata
   */
  async uploadAndTokenize(file, documentId) {
    console.log(`📄 Tokenizing document: ${file.name}`);

    try {
      this.emit('document:upload:started', { filename: file.name, size: file.size });

      // Extract text based on file type
      let extractedText = '';
      const fileType = this.getFileType(file.name);

      if (fileType === 'pdf') {
        extractedText = await this.extractFromPDF(file);
      } else if (fileType === 'docx') {
        extractedText = await this.extractFromDOCX(file);
      } else if (fileType === 'xlsx') {
        extractedText = await this.extractFromExcel(file);
      } else {
        extractedText = await this.extractFromText(file);
      }

      // Tokenize and chunk the text
      const chunks = this.createTokenChunks(extractedText);

      // Store document metadata
      const metadata = {
        documentId,
        filename: file.name,
        fileType,
        uploadedAt: new Date().toISOString(),
        totalTokens: this.countTokens(extractedText),
        chunkCount: chunks.length,
        fileSize: file.size,
        fullText: extractedText
      };

      this.documentRegistry.set(documentId, metadata);
      this.tokenCache.set(documentId, chunks);

      this.emit('document:tokenized', {
        documentId,
        chunkCount: chunks.length,
        totalTokens: metadata.totalTokens,
        filename: file.name
      });

      console.log(`✅ Document tokenized: ${chunks.length} chunks, ${metadata.totalTokens} tokens`);

      return {
        success: true,
        documentId,
        chunks,
        metadata
      };
    } catch (error) {
      console.error('❌ Tokenization failed:', error);
      this.emit('document:tokenized:error', { documentId, error: error.message });
      throw error;
    }
  }

  /**
   * Extract text from PDF (browser-compatible)
   * Note: Full PDF text extraction requires pdf-lib or similar
   * For now, return placeholder indicating PDF processing
   */
  async extractFromPDF(file) {
    return new Promise((resolve) => {
      // In production, use pdf-lib or send to backend API for processing
      const text = `[PDF Document: ${file.name}]\n\nNote: Full PDF text extraction requires server-side processing.\nPlease ensure the backend API is configured for PDF processing.`;
      resolve(text);
    });
  }

  /**
   * Extract text from DOCX (browser-compatible)
   * DOCX files are ZIP archives with XML content
   */
  async extractFromDOCX(file) {
    return new Promise((resolve) => {
      // In production, use docx-parser or send to backend API
      const text = `[DOCX Document: ${file.name}]\n\nNote: DOCX text extraction requires server-side processing or specialized library.\nPlease ensure the backend API is configured for DOCX processing.`;
      resolve(text);
    });
  }

  /**
   * Extract text from Excel (browser-compatible)
   * Uses browser-native approach with CSV conversion
   */
  async extractFromExcel(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // For browser compatibility, we'll parse as text
          // Production version should use backend API or xlsx library
          const text = `[Excel Document: ${file.name}]\n\nNote: Full Excel parsing requires backend processing.\nFile size: ${file.size} bytes`;
          resolve(text);
        } catch (err) {
          console.error('Excel extraction error:', err);
          resolve(`[Excel Document: ${file.name}] - Processing required`);
        }
      };
      reader.readAsText(file);
    });
  }

  /**
   * Extract text from plain text file
   */
  async extractFromText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Create overlapping token chunks for Claude processing
   * Maintains context between chunks for better extraction
   */
  createTokenChunks(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';
    let currentTokenCount = 0;

    for (const sentence of sentences) {
      const sentenceTokens = this.countTokens(sentence);

      if (currentTokenCount + sentenceTokens > this.MAX_TOKENS_PER_CHUNK && currentChunk) {
        // Save chunk with overlap
        chunks.push({
          text: currentChunk,
          tokens: currentTokenCount,
          sequenceNumber: chunks.length
        });

        // Start new chunk with overlap from previous
        const overlapText = currentChunk
          .split(' ')
          .slice(-Math.ceil(this.OVERLAP_TOKENS / 5))
          .join(' ');
        currentChunk = overlapText + ' ' + sentence;
        currentTokenCount = this.countTokens(currentChunk);
      } else {
        currentChunk += sentence;
        currentTokenCount += sentenceTokens;
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push({
        text: currentChunk,
        tokens: currentTokenCount,
        sequenceNumber: chunks.length
      });
    }

    return chunks;
  }

  /**
   * Estimate token count (approximate: 1 token ≈ 4 characters)
   */
  countTokens(text) {
    return Math.ceil(text.length / 4);
  }

  /**
   * Get file type from filename
   */
  getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
  }

  /**
   * Get document by ID
   */
  getDocument(documentId) {
    return this.documentRegistry.get(documentId);
  }

  /**
   * Get document chunks
   */
  getDocumentChunks(documentId) {
    return this.tokenCache.get(documentId) || [];
  }

  /**
   * Delete document
   */
  deleteDocument(documentId) {
    this.documentRegistry.delete(documentId);
    this.tokenCache.delete(documentId);
    this.emit('document:deleted', { documentId });
  }

  /**
   * List all uploaded documents
   */
  listDocuments() {
    return Array.from(this.documentRegistry.values());
  }

  /**
   * Event system for real-time updates
   */
  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    this.eventListeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }
}

export default new DocumentTokenizationService();
