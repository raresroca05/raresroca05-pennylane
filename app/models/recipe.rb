class Recipe < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients

  validates :title, presence: true
  validates :cook_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :prep_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :ratings, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }

  scope :by_ingredients, ->(ingredient_names) {
    joins(:ingredients)
      .where(ingredients: { name: ingredient_names })
      .group(:id)
      .having("COUNT(DISTINCT ingredients.id) = ?", ingredient_names.count)
  }

  def total_time
    (cook_time || 0) + (prep_time || 0)
  end
end
