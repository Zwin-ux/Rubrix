from flask import Flask, request, jsonify
import logging
import os
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Check if transformers is installed, if not provide instructions
try:
    from transformers import pipeline
    # Use a smaller model for development if needed
    MODEL_NAME = os.environ.get("AI_MODEL_NAME", "codellama/CodeLlama-7b-Instruct-hf")
    logger.info(f"Using model: {MODEL_NAME}")
    
    # Initialize the pipeline (lazy-loading)
    pipe = None
    
except ImportError:
    logger.error("Transformers library not installed. Run: pip install transformers torch")
    
@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok", "model": os.environ.get("AI_MODEL_NAME", "codellama/CodeLlama-7b-Instruct-hf")})

@app.route("/generate", methods=["POST"])
def generate():
    """Generate text using the AI model"""
    global pipe
    
    # Initialize pipeline on first request (lazy loading)
    if pipe is None:
        try:
            logger.info("Initializing the model pipeline...")
            pipe = pipeline("text-generation", model=MODEL_NAME)
            logger.info("Model pipeline initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize model: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    # Get request data
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    prompt = data.get("prompt", "")
    max_tokens = data.get("max_tokens", 256)
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    try:
        # Generate text
        logger.info(f"Generating text for prompt: {prompt[:50]}...")
        result = pipe(prompt, max_new_tokens=max_tokens)
        generated_text = result[0]["generated_text"]
        logger.info(f"Text generated successfully: {len(generated_text)} chars")
        
        return jsonify({
            "result": generated_text,
            # Extract just the AI response part (everything after the prompt)
            "response": generated_text[len(prompt):].strip()
        })
    except Exception as e:
        logger.error(f"Error during text generation: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("AI_SERVICE_PORT", 8008))
    app.run(host="0.0.0.0", port=port)
    logger.info(f"AI service running on port {port}")
