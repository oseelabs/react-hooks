import os
import sys

# Add the path to your Node.js project
sys.path.insert(0, os.path.abspath('../../'))

# Project information
project = '@oseelabs/react-hooks'
author = 'Lazaro Osee <odiraoseelazaro@gmail.com>'
release = '0.1.0'

# General configuration
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx_js',  # For JavaScript/TypeScript support
]

# Sphinx-JS configuration
js_source_path = '../../src/hooks.ts'  # Adjust to the path of your Node.js code

# HTML configuration
html_theme = 'sphinx_rtd_theme'
