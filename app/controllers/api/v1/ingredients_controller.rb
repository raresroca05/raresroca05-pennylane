class Api::V1::IngredientsController < Api::V1::ApplicationController
  def index
    @ingredients = if params[:q].present?
                     Ingredient.where("name ILIKE ?", "%#{params[:q].downcase}%")
                               .order(:name)
                               .limit(20)
    else
                     Ingredient.order(:name).limit(params[:limit] || 100)
    end

    # Return with IDs for admin functionality, or just names for autocomplete
    if params[:with_ids] == "true"
      render json: {
        ingredients: @ingredients.map { |i| { id: i.id, name: i.name } },
        total: Ingredient.count
      }
    else
      render json: {
        ingredients: @ingredients.pluck(:name),
        total: Ingredient.count
      }
    end
  end
end
