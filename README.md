# EscapeBook

## Overview

EscapeBook is an innovative e-commerce web application designed to provide personalized recommendations for cultural products — primarily books — by combining behavioral analysis, Natural Language Processing (NLP) and sentiment-based feedback evaluation.

Unlike traditional recommendation engines that rely solely on popularity or ratings, EscapeBook interprets what the user liked and why they liked it, analyzing reviews, favorite authors, genres, and emotional tone to generate relevant, human-like suggestions.

## Motivation

In today’s digital economy, personalization is no longer optional — it’s essential.
Readers expect digital bookstores not only to sell books, but to understand their preferences and guide them toward titles that fit their mood, interests, and emotional profile.

EscapeBook was developed to address this gap by:
- Enhancing the online reading experience through AI-driven personalization.
- Demonstrating how data science and sentiment analysis can improve user engagement.
- Encouraging cultural consumption and reading habits in an interactive, intelligent way.

## Main Features
- Secure authentication (JWT-based) for users and admins
- Complete e-commerce flow: add to cart, place order, and payment via Stripe
- Review system with sentiment & aspect-based analysis (NLP)
- AI-powered Chatbot trained with Chatbase to assist users
- Personalized recommendations generated from:
    - user favorites;
    - previous purchases;
    - review tone and extracted aspects.
- Admin dashboard with sales and genre statistics (Chart.js)

## Technologies Used
- Frontend
    - React.js – Component-based UI for dynamic rendering and reusable elements
    - Redux Toolkit – Centralized state management
    - Tailwind CSS – Utility-first CSS framework for responsive modern design
    - React Router DOM – Client-side routing and navigation

- Backend
    - Node.js + Express.js – RESTful API handling requests and application logic
    - JWT (JSON Web Tokens) – Secure authentication between client and server
    - Axios – HTTP client for async data exchange between frontend and backend

- Database
    - MongoDB – Flexible NoSQL database for document-oriented storage
    - Mongoose – Schema definition and model validation

- NLP Microservice
    - Python + FastAPI – Lightweight, high-performance microservice for text analysis
    - Transformers (HuggingFace) – Pretrained models for zero-shot classification and aspect-based sentiment analysis
    - Sentiment.js – Simple lexical sentiment scoring for overall tone detection

- Other Tools
    - Stripe API – Secure online payments
    - Chart.js – Visualization of analytics in the admin dashboard
    - dotenv – Environment variable management for secure configuration

## Data Model
- User -> Stores profile data, favorites, cart, and order history
- Book -> Book catalog including title, author, genre, price, description
- Order -> Contains book reference, user, and payment status
- Review -> Includes rating, comment, detected sentiment, and analyzed aspects