class Api::V1::RecipesController < Api::V1::ApplicationController
  before_action :set_recipe, only: [ :show ]

  def index
    @recipes = Recipe.includes(:ingredients)
                     .limit(params[:limit] || 20)
                     .offset(params[:offset] || 0)
                     .order(:title)

    render json: {
      recipes: @recipes.map { |recipe| recipe_json(recipe) },
      total: Recipe.count
    }
  end

  def show
    render json: { recipe: recipe_json(@recipe) }
  end

  def create
    @recipe = Recipe.new(recipe_params)
    @recipe.author = "admin"
    @recipe.ratings = 0.0

    if @recipe.save
      # Associate ingredients if provided
      if params[:ingredient_ids].present?
        ingredient_ids = params[:ingredient_ids].map(&:to_i)
        ingredients = Ingredient.where(id: ingredient_ids)
        ingredients.each do |ingredient|
          @recipe.recipe_ingredients.create!(ingredient: ingredient)
        end
      end

      render json: {
        recipe: recipe_json(@recipe.reload),
        message: "Recipe created successfully!"
      }, status: :created
    else
      render json: {
        errors: @recipe.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def search
    ingredient_names = params[:ingredients]&.split(",")&.map(&:strip)&.map(&:downcase)

    if ingredient_names.blank?
      render json: { recipes: [], message: "Please provide ingredients to search" }
      return
    end

    # Find recipes that contain ALL the specified ingredients
    recipe_ids = Recipe.joins(:ingredients)
                       .where(ingredients: { name: ingredient_names })
                       .group("recipes.id")
                       .having("COUNT(DISTINCT ingredients.id) = ?", ingredient_names.count)
                       .pluck(:id)

    @recipes = Recipe.where(id: recipe_ids)
                     .includes(:ingredients)
                     .order(ratings: :desc, title: :asc)
                     .limit(50)

    render json: {
      recipes: @recipes.map { |recipe| recipe_json(recipe) },
      searched_ingredients: ingredient_names,
      total: @recipes.count
    }
  end

  private

  def set_recipe
    @recipe = Recipe.includes(:ingredients).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  def recipe_params
    params.require(:recipe).permit(:title, :cook_time, :prep_time, :cuisine, :category, :image_url)
  end

  def recipe_json(recipe)
    {
      id: recipe.id,
      title: recipe.title,
      cook_time: recipe.cook_time,
      prep_time: recipe.prep_time,
      total_time: recipe.total_time,
      ratings: recipe.ratings,
      cuisine: recipe.cuisine,
      category: recipe.category,
      author: recipe.author,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients.pluck(:name).sort
    }
  end
end
