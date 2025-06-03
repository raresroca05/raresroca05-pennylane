# Recipe Finder Application

### _It's dinner time!_ This application helps users find the most relevant recipes that they can prepare with the ingredients that they have at home

## User Stories

### 1. **As a home cook, I want to input the ingredients I have available so that I can find recipes I can actually make**
- **Given** I have ingredients at home like "chicken", "onions", and "garlic"
- **When** I type these ingredients into the search input
- **Then** I can see ingredient suggestions appear as I type to help me find the exact ingredient names
- **And** I can select ingredients from the suggestions or add them manually
- **And** I can see all my selected ingredients displayed as removable tags

### 2. **As someone looking for dinner ideas, I want to search for recipes that use ALL the ingredients I have so that I don't waste food**
- **Given** I have selected multiple ingredients like "chicken" and "celery ribs"
- **When** I click the "Find Recipes" button
- **Then** I see a list of recipes that contain ALL of my selected ingredients
- **And** the recipes are ordered by rating (highest first) so I can see the best options
- **And** each recipe shows the cooking time, prep time, rating, cuisine type, and ingredient list

### 3. **As a busy person, I want to see recipe details at a glance so that I can quickly decide what to cook**
- **Given** I have searched for recipes with my available ingredients
- **When** I view the search results
- **Then** I can see recipe cards that display:
  - Recipe title and image (with fallback if image fails to load)
  - Total cooking time (prep + cook time)
  - Star rating
  - Cuisine type
  - First 6 ingredients with a count of additional ingredients
- **And** the interface is responsive and works well on both desktop and mobile devices

### 4. **As a food enthusiast, I want to browse all available recipes and see detailed recipe information so that I can discover new dishes and get complete cooking instructions**
- **Given** I want to explore the recipe collection beyond ingredient-based search
- **When** I navigate to the "All Recipes" section
- **Then** I can browse through all recipes with pagination (12 recipes per page)
- **And** I can see the total number of recipes available
- **When** I click on any recipe title or "View Recipe" button
- **Then** I see a detailed recipe page that displays:
  - Large recipe image with fallback placeholder
  - Complete recipe information (prep time, cook time, total time, rating)
  - Recipe metadata (cuisine, category, author when available)
  - Complete ingredient list organized in an easy-to-read format
  - Navigation controls to return to the previous view
- **And** I can easily navigate between recipe browsing, ingredient search, and detailed views

## Technical Implementation

- **Backend**: Ruby on Rails 7.2 with PostgreSQL database
- **Frontend**: React 18 with Tailwind CSS for styling
- **Data**: English-language recipes scraped from allrecipes.com
- **API**: RESTful JSON API with endpoints for recipes and ingredients
- **Search**: Finds recipes containing ALL specified ingredients (exact match)

## Features Implemented

✅ Recipe dataset imported from allrecipes.com (13,000+ recipes)  
✅ Ingredient autocomplete with fuzzy search  
✅ Recipe search by multiple ingredients  
✅ Recipe browsing with pagination  
✅ Detailed recipe view with complete information  
✅ Navigation between search, browse, and detail views  
✅ Clean, modern UI with responsive design  
✅ Recipe cards showing key information at a glance  
✅ Image handling with fallbacks  
✅ Real-time ingredient suggestions  
✅ Rating-based recipe ordering  

## Getting Started

1. Clone the repository
2. Install dependencies: `bundle install`
3. Set up the database: `rails db:create db:migrate`
4. Import recipe data: `rails db:seed`
5. Start the server: `rails server`
6. Visit `http://localhost:3000`

## API Endpoints

- `GET /api/v1/ingredients?q=search_term` - Get ingredient suggestions
- `GET /api/v1/recipes/search?ingredients=ingredient1,ingredient2` - Search recipes by ingredients
- `GET /api/v1/recipes` - List all recipes (paginated)
- `GET /api/v1/recipes/:id` - Get specific recipe details

---

## Original Problem Statement

### _It's dinner time!_ Create an application that helps users find the most relevant recipes that they can prepare with the ingredients that they have at home

## Objective

Deliver a prototype web application to answer the above problem statement.

__✅ Must have's__

- A back-end with Ruby on Rails (If you don't know Ruby on Rails, refer to the FAQ)
- A SQL-compliant relational database
- A well-thought user experience

__🚫 Don'ts__

- Excessive effort in styling
- Features which don't directly answer the above statement
- Over-engineer your prototype

## Deliverable

- The codebase should be pushed on the current GitHub private repository.
- 2 or 3 user stories that address the statement in your repo's `README.md`.
- The application accessible online (a personal server, fly.io or something else).
- Submission of the above via [this form](https://forms.gle/siH7Rezuq2V1mUJGA).
- If you're on Mac, make sure your browser has [permission to share the screen](https://support.apple.com/en-al/guide/mac-help/mchld6aa7d23/mac).


## Data

Please start from the following dataset to perform the assignment:
[english-language recipes](https://pennylane-interviewing-assets-20220328.s3.eu-west-1.amazonaws.com/recipes-en.json.gz) scraped from www.allrecipes.com with [recipe-scrapers](https://github.com/hhursev/recipe-scrapers)

Download it with this command if the above link doesn't work:
```sh textWrap
wget https://pennylane-interviewing-assets-20220328.s3.eu-west-1.amazonaws.com/recipes-en.json.gz && gzip -dc recipes-en.json.gz > recipes-en.json
```

## FAQ

<details>
<summary><i>I'm a back-end developer or don't know React, what do I do?</i></summary>

Just make the simplest UI, style isn't important and server rendered HTML pages will do!
</details>

<details>
<summary><i>Can I have a time extension for the test?</i></summary>

No worries, we know that unforeseen events happen, simply reach out to the recruiter you've been
talking with to discuss this.
</details>

<details>
<summary><i>Can I transform the dataset before seeding it in the DB</i></summary>

Absolutely, feel free to post-process the dataset as needed to fit your needs.
</details>

<details>
<summary><i>Should I rather implement option X or option Y</i></summary>

That decision is up to you and part of the challenge. Please document your choice
to be able to explain your reflexion and choice to your interviewer for the
challenge debrief.
</details>

<details>
<summary><i>I tried to make it available online but can't make it work</i></summary>

Don't overinvest time (or money) on this if you really can't figure it out and we'll
assess over your local version. Please make sure everything is working smoothly
locally before your debrief interview.
</details>

<details>
<summary><i>I don't know <b>Ruby on Rails</b></i></summary>

That probably means you're applying for a managerial position, so it's fine to
pick another language of your choice to perform this task.
</details>
