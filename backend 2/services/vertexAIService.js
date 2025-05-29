const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');

class VertexAIService {
  constructor() {
    // Service account credentials
    this.credentials = {
      type: "service_account",
      project_id: "i-gateway-461222-p6",
      private_key_id: "8eb126df7eb7066dc661b2174a35d1004aadb133",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCiL8Eo3lxsfpaM\nTw1xBmpq2jEKqOwb1WL6uTSF8m5XklZObEElrN79XiYD+nLyxPEhY2uZ/8egSvXM\nT2/AhNKIAnXLiUDqjP7d7d9/a4UbRTQOyX6SrqLHm2KIGEX21urfsaFjiIbqrgyM\nb3qaXIup6diOjqTAByzIbpKNfYWsmf+qsESBYRcYzA+4QlJ6Em7Mr4JUCMxYLd0a\nhTf8eo8s396iu56K+bmbIDXk4OlUgoMQsuN9rFhSpdmxEQg+LQu9DvRZL/kMIR6l\neeZQBWKzCRrx98xkyPyFn1yIRXf1ArxvH8KVE6q6yW1Og+Sgbxm8XX2ZR5HCLJ+W\nWwBTpMM1AgMBAAECggEABWjWJpcc4Knr1I84cabwoR+MJJpgxOB+D8KVcjHiJOQz\niIpLNZOWaaYC9GQDz7DqiAR2AANytMtIEOhfX/D6/Eb0uqhMmxlYna3DvbWOd+V7\n6IUnX+lL2NOIDeXQkGMEheSGiQU/PSmdlbuMJjgXzAy8+96qURTylSOjzYaJXfaq\n+fP123Jn9A+vnQKL0gAt6CsJOjlT8LonVkvSz+2ca7j0jRlZXn429dfxjMb+7rfe\nnJpSrwoS/FiP8F7b2+Xd3Y2ZOAfkCaYP9jj3hOEKzyf8OBIq/WdFnyk/+8APF6SE\nysAo7q0XoPV7oBWXWNejQv5fu+3ynOZFzeI6IKfn2wKBgQDUYewZCnvpCrJaE767\nVcdDXvDXIFZdNldBsVgB6CBBEliG26J9wcSK4aQ0QDJYIq9DdrCLguC9ciwpoZAN\nxrz4lddsk/Xi3E4hZswnVZcgOl/8zIGhB5r4i79oqkP8ZdzcbJ06eithLHKsusI4\nzQA6IAxJPTwcFGnN8lsIu2Sv+wKBgQDDfsNrR3ThCGpwebapDgS/epxR1jW/LF4Z\nyHEi8t34jDnZ+p3ee5Aaj/eKDjVLUpfwM422D9t+lGducAeWBdKAfRza4gku9qwk\nJuaxnDGDjUj7SVvPwrXmdZv8aqGwn5noYxaB6tFAGVEk8qn5rfVU9JT/q2FMqOoH\nP7kWm8uCjwKBgDyDPhMQcqe+vXx+3bxgv2rJtVOGSjU603fLQOkiK3Z+9KxQDidI\nu2hazD96/x0vnMJbIghOHRy9WCnwd6wFMTie8QdlzQx7euN3d7nJYEr1dv3/gvvP\nv+8LWllHEiHrIBfJ9q5/urZwRKhEeixW9LabBQUlJmhVxKPCZv/A7PpbAoGAFsyC\nx9EWjWPo3eMj7UVIQnhvIJAlxnzLIKCiqRu/zUu1N3mlzZuFa8Ocb8pGZtlkBMxO\nW4wv4ew2v8dq6xEUwo1UvyYbQhHcc37h6pa3o4rnlv6wKWOgyRawMVjSMIH8dgCQ\nUGhtLNeHAhMWxZqHAPhhJAv9le4hFOVWlY9nxXsCgYBqTAKq5AMZLUh06KZv93C0\nfgsVL2X4OYysueXYfjFYamTr/KrQ5oHoKyPGnvKAOE/hYX6xNxfGZ1WjXPQeYMCC\nTk9OsdJfDgzWAZdW30HQJ7PDMkQDmbdIBvFgGwpvty5HMKabyhwQkk22p+UsnanJ\nEOvRL8RQrV2fxy1XqbnOYg==\n-----END PRIVATE KEY-----\n",
      client_email: "hackathon@i-gateway-461222-p6.iam.gserviceaccount.com",
      client_id: "115678830710657527726",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/hackathon%40i-gateway-461222-p6.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    };

    // Initialize Vertex AI
    this.projectId = "i-gateway-461222-p6";
    this.location = "us-central1";
    this.initializeVertexAI();
  }

  async initializeVertexAI() {
    try {
      // Set up authentication using service account
      process.env.GOOGLE_APPLICATION_CREDENTIALS = this.createTempCredentialsFile();
      
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
      
      this.model = this.vertexAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp'
      });
      
      console.log('Vertex AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Vertex AI:', error);
      throw error;
    }
  }

  createTempCredentialsFile() {
    const tempPath = path.join(__dirname, 'temp-credentials.json');
    fs.writeFileSync(tempPath, JSON.stringify(this.credentials, null, 2));
    return tempPath;
  }

  // Extract marks from marksheet image
  async extractMarksFromImage(imagePath) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Read image as base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const prompt = `
        This is a marksheet. Extract English, Maths, Science percentage in a structured JSON table. 
        If multiple English are there like English 1 and English 2 then return the average of both.
        Example:
        {
            "Mathematics": 95,
            "Science": 88,
            "English": 90
        }
        Only return JSON, no explanation.
      `;

      const request = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              },
              {
                inlineData: {
                  mimeType: this.getMimeType(imagePath),
                  data: base64Image
                }
              }
            ]
          }
        ]
      };

      const result = await this.model.generateContent(request);
      const response = await result.response;
      
      return response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Vertex AI image analysis error:', error);
      throw error;
    }
  }

  // Process multiple marksheet images
  async processMultipleImages(imagePaths, maxImages = 3) {
    try {
      const results = {};
      const finalResult = { Mathematics: 0, English: 0, Science: 0 };
      const subjectCounts = { Mathematics: 0, English: 0, Science: 0 };

      const pathsToProcess = imagePaths.slice(0, maxImages);

      for (let i = 0; i < pathsToProcess.length; i++) {
        const imagePath = pathsToProcess[i];
        console.log(`Processing image ${i + 1}: ${path.basename(imagePath)}...`);
        
        try {
          const output = await this.extractMarksFromImage(imagePath);
          results[path.basename(imagePath)] = output;

          // Extract JSON from output
          const jsonMatch = this.extractJSON(output);
          if (jsonMatch) {
            const marksDict = JSON.parse(jsonMatch);
            
            for (const subject in finalResult) {
              if (marksDict[subject] !== undefined) {
                finalResult[subject] += marksDict[subject];
                subjectCounts[subject] += 1;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing ${imagePath}:`, error);
          results[path.basename(imagePath)] = `Error: ${error.message}`;
        }
      }

      // Compute averages
      for (const subject in finalResult) {
        const count = subjectCounts[subject];
        finalResult[subject] = count > 0 ? Math.round((finalResult[subject] / count) * 100) / 100 : 0;
      }

      // Convert to 0-5 scale (divide by 20)
      const normalizedResult = {};
      for (const subject in finalResult) {
        normalizedResult[subject.toLowerCase()] = Math.round((finalResult[subject] / 20) * 100) / 100;
      }

      return {
        success: true,
        individualResults: results,
        averageScores: normalizedResult,
        processedCount: pathsToProcess.length
      };
    } catch (error) {
      console.error('Multiple image processing error:', error);
      return {
        success: false,
        error: error.message,
        averageScores: { mathematics: 0, science: 0, english: 0 }
      };
    }
  }

  // Extract JSON from text response
  extractJSON(text) {
    const match = text.match(/\{.*?\}/s);
    return match ? match[0] : null;
  }

  // Get MIME type based on file extension
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'image/jpeg';
    }
  }

  // Health check for Vertex AI
  async healthCheck() {
    try {
      const request = {
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Say "OK" if you are working properly.' }]
          }
        ]
      };

      const result = await this.model.generateContent(request);
      const response = await result.response;
      
      return {
        status: 'healthy',
        response: response.candidates[0].content.parts[0].text.trim()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Cleanup temp credentials file
  cleanup() {
    try {
      const tempPath = path.join(__dirname, 'temp-credentials.json');
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new VertexAIService(); 