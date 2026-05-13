#!/usr/bin/env python3
"""
Generate a new skill from template.
Usage: python generate_skill.py <skill_name>
"""

import sys
import os

def generate_skill(skill_name):
    """Generate new skill directory and files."""
    print(f"Generating skill: {skill_name}")
    # Implementation here

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_skill.py <skill_name>")
        sys.exit(1)
    generate_skill(sys.argv[1])
