#!/usr/bin/env python3
"""
Generate a new prompt from template.
Usage: python generate_prompt.py <prompt_name>
"""

import sys
import os

def generate_prompt(prompt_name):
    """Generate new prompt file."""
    print(f"Generating prompt: {prompt_name}")
    # Implementation here

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_prompt.py <prompt_name>")
        sys.exit(1)
    generate_prompt(sys.argv[1])
