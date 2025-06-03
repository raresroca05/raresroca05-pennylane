# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data
puts "Clearing existing data..."
Recipe.destroy_all
Ingredient.destroy_all

puts "Loading recipe data..."
recipes_json = JSON.parse(File.read(Rails.root.join('recipes-en.json')))

puts "Found #{recipes_json.length} recipes to import..."

# Helper method to clean ingredient names
def clean_ingredient_name(ingredient)
  return nil if ingredient.nil?

  begin
    # Remove quantities, measurements, and parenthetical descriptions
    cleaned = ingredient.to_s
      .gsub(/^\d+(\.\d+)?\s*/, '') # Remove leading numbers
      .gsub(/^\d+\/\d+\s*/, '') # Remove fractions
      .gsub(/\([^)]*\)/, '') # Remove parenthetical content
      .gsub(/\b(cup|cups|tablespoon|tablespoons|teaspoon|teaspoons|pound|pounds|ounce|ounces|oz|lb|tsp|tbsp|clove|cloves|slice|slices|can|jar|package|bunch|head|stalk|stalks)\b.*/, '') # Remove measurements and everything after
      .gsub(/\b(chopped|diced|minced|sliced|crushed|grated|shredded|fresh|dried|ground|whole|large|small|medium|cooked|raw|prepared|seedless|boneless|skinless)\b/, '') # Remove descriptors

    # Take only the first part if comma-separated
    parts = cleaned.split(',')
    return nil if parts.empty?

    result = parts.first&.strip&.downcase
    return result if result && result.length >= 2

    nil
  rescue => e
    puts "Error cleaning ingredient '#{ingredient}': #{e.message}"
    nil
  end
end

recipes_json.each_with_index do |recipe_data, index|
  puts "Processing recipe #{index + 1}/#{recipes_json.length}: #{recipe_data['title']}"

  # Create recipe
  recipe = Recipe.create!(
    title: recipe_data['title'],
    cook_time: recipe_data['cook_time'] || 0,
    prep_time: recipe_data['prep_time'] || 0,
    ratings: recipe_data['ratings'] || 0,
    cuisine: recipe_data['cuisine'],
    category: recipe_data['category'],
    author: recipe_data['author'],
    image_url: recipe_data['image']
  )

  # Process ingredients
  if recipe_data['ingredients']
    recipe_data['ingredients'].each do |ingredient_text|
      # Clean and extract the main ingredient name
      clean_name = clean_ingredient_name(ingredient_text)

      # Skip if the cleaned name is too short or empty
      next if clean_name.blank? || clean_name.length < 2

      # Find or create ingredient
      ingredient = Ingredient.find_or_create_by(name: clean_name)

      # Associate with recipe
      recipe.recipe_ingredients.create!(ingredient: ingredient)
    end
  end

  # Print progress every 100 recipes
  if (index + 1) % 100 == 0
    puts "Imported #{index + 1} recipes..."
  end
end

puts "Seed completed!"
puts "Total recipes: #{Recipe.count}"
puts "Total ingredients: #{Ingredient.count}"
puts "Total recipe-ingredient associations: #{RecipeIngredient.count}"
