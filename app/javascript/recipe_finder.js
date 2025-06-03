const { useState, useEffect } = React;

// Utility function to check if user is admin
const isAdmin = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('user') === 'admin';
};

// Navigation Component
const Navigation = ({ currentView, setCurrentView }) => {
  const adminMode = isAdmin();

  return React.createElement(
    'nav',
    {
      className: 'bg-white shadow-sm border-b mb-6',
    },
    React.createElement(
      'div',
      {
        className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      },
      React.createElement(
        'div',
        {
          className: 'flex justify-between items-center py-4',
        },
        [
          React.createElement(
            'h1',
            {
              key: 'title',
              className: 'text-2xl font-bold text-gray-900',
            },
            '🍽️ Recipe Finder'
          ),
          React.createElement(
            'div',
            {
              key: 'nav-links',
              className: 'flex space-x-4',
            },
            [
              React.createElement(
                'button',
                {
                  key: 'search',
                  onClick: () => setCurrentView('search'),
                  className: `px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'search'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`,
                },
                'Search Recipes'
              ),
              React.createElement(
                'button',
                {
                  key: 'index',
                  onClick: () => setCurrentView('index'),
                  className: `px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'index'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`,
                },
                'All Recipes'
              ),
              adminMode && React.createElement(
                'button',
                {
                  key: 'create',
                  onClick: () => setCurrentView('create'),
                  className: `px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'create'
                      ? 'bg-green-600 text-white'
                      : 'text-green-600 hover:text-green-900 border border-green-600'
                  }`,
                },
                'Create Recipe'
              ),
            ]
          ),
        ]
      )
    )
  );
};

// Recipe Card Component
const RecipeCard = ({ recipe, onViewRecipe }) => {
  const [imageError, setImageError] = useState(false);

  return React.createElement('div', {
    className: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
  }, [
    // Image
    !imageError && recipe.image_url ? React.createElement('img', {
      key: 'image',
      src: recipe.image_url,
      alt: recipe.title,
      className: 'w-full h-48 object-cover',
      onError: () => setImageError(true)
    }) : React.createElement('div', {
      key: 'placeholder',
      className: 'w-full h-48 bg-gray-200 flex items-center justify-center'
    }, React.createElement('span', {
      className: 'text-gray-500 text-6xl'
    }, '🍽️')),
    
    // Content
    React.createElement('div', {
      key: 'content',
      className: 'p-4'
    }, [
      React.createElement('h3', {
        key: 'title',
        className: 'font-bold text-lg mb-2 text-gray-900 cursor-pointer hover:text-blue-600',
        onClick: () => onViewRecipe(recipe.id)
      }, recipe.title),
      
      React.createElement('div', {
        key: 'meta',
        className: 'flex justify-between items-center mb-2 text-sm text-gray-600'
      }, [
        React.createElement('span', {
          key: 'time'
        }, `⏱️ ${recipe.total_time} min`),
        React.createElement('span', {
          key: 'rating',
          className: 'flex items-center'
        }, `⭐ ${recipe.ratings && !isNaN(recipe.ratings) ? Number(recipe.ratings).toFixed(1) : 'N/A'}`)
      ]),
      
      recipe.cuisine && React.createElement('p', {
        key: 'cuisine',
        className: 'text-sm text-gray-600 mb-2'
      }, `Cuisine: ${recipe.cuisine}`),
      
      React.createElement('div', {
        key: 'ingredients',
        className: 'mt-3'
      }, [
        React.createElement('p', {
          key: 'label',
          className: 'text-sm font-medium text-gray-700 mb-1'
        }, 'Ingredients:'),
        React.createElement('div', {
          key: 'list',
          className: 'flex flex-wrap gap-1'
        }, recipe.ingredients.slice(0, 6).map((ingredient, index) => 
          React.createElement('span', {
            key: index,
            className: 'bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'
          }, ingredient)
        )),
        recipe.ingredients.length > 6 && React.createElement('span', {
          key: 'more',
          className: 'text-xs text-gray-500 mt-1'
        }, `+${recipe.ingredients.length - 6} more...`)
      ]),
      
      React.createElement('button', {
        key: 'view-button',
        onClick: () => onViewRecipe(recipe.id),
        className: 'mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors'
      }, 'View Recipe')
    ])
  ]);
};

// Recipe Show Component
const RecipeShow = ({ recipeId, onBack }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      fetch(`/api/v1/recipes/${recipeId}`)
        .then(res => {
          if (!res.ok) throw new Error('Recipe not found');
          return res.json();
        })
        .then(data => {
          setRecipe(data.recipe);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching recipe:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [recipeId]);

  if (loading) {
    return React.createElement('div', {
      className: 'text-center py-8'
    }, React.createElement('div', {
      className: 'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
    }));
  }

  if (error) {
    return React.createElement('div', {
      className: 'text-center py-8'
    }, [
      React.createElement('p', {
        key: 'error',
        className: 'text-red-600 mb-4'
      }, `Error: ${error}`),
      React.createElement('button', {
        key: 'back',
        onClick: onBack,
        className: 'bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700'
      }, 'Go Back')
    ]);
  }

  if (!recipe) return null;

  return React.createElement('div', {
    className: 'max-w-4xl mx-auto'
  }, [
    React.createElement('button', {
      key: 'back-button',
      onClick: onBack,
      className: 'mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
    }, '← Back'),
    
    React.createElement('div', {
      key: 'recipe-content',
      className: 'bg-white rounded-lg shadow-lg overflow-hidden'
    }, [
      // Image
      !imageError && recipe.image_url ? React.createElement('img', {
        key: 'image',
        src: recipe.image_url,
        alt: recipe.title,
        className: 'w-full h-64 md:h-80 object-cover',
        onError: () => setImageError(true)
      }) : React.createElement('div', {
        key: 'placeholder',
        className: 'w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center'
      }, React.createElement('span', {
        className: 'text-gray-500 text-8xl'
      }, '🍽️')),
      
      React.createElement('div', {
        key: 'content',
        className: 'p-6'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-3xl font-bold text-gray-900 mb-4'
        }, recipe.title),
        
        React.createElement('div', {
          key: 'meta',
          className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm'
        }, [
          React.createElement('div', {
            key: 'prep-time',
            className: 'bg-gray-50 p-3 rounded-lg'
          }, [
            React.createElement('p', {
              key: 'label',
              className: 'font-medium text-gray-700'
            }, 'Prep Time'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, `${recipe.prep_time} min`)
          ]),
          React.createElement('div', {
            key: 'cook-time',
            className: 'bg-gray-50 p-3 rounded-lg'
          }, [
            React.createElement('p', {
              key: 'label',
              className: 'font-medium text-gray-700'
            }, 'Cook Time'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, `${recipe.cook_time} min`)
          ]),
          React.createElement('div', {
            key: 'total-time',
            className: 'bg-gray-50 p-3 rounded-lg'
          }, [
            React.createElement('p', {
              key: 'label',
              className: 'font-medium text-gray-700'
            }, 'Total Time'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, `${recipe.total_time} min`)
          ]),
          React.createElement('div', {
            key: 'rating',
            className: 'bg-gray-50 p-3 rounded-lg'
          }, [
            React.createElement('p', {
              key: 'label',
              className: 'font-medium text-gray-700'
            }, 'Rating'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, `⭐ ${recipe.ratings && !isNaN(recipe.ratings) ? Number(recipe.ratings).toFixed(1) : 'N/A'}`)
          ])
        ]),
        
        React.createElement('div', {
          key: 'details',
          className: 'grid md:grid-cols-2 gap-6 mb-6'
        }, [
          recipe.cuisine && React.createElement('div', {
            key: 'cuisine'
          }, [
            React.createElement('h3', {
              key: 'label',
              className: 'text-lg font-semibold text-gray-900 mb-2'
            }, 'Cuisine'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, recipe.cuisine)
          ]),
          recipe.category && React.createElement('div', {
            key: 'category'
          }, [
            React.createElement('h3', {
              key: 'label',
              className: 'text-lg font-semibold text-gray-900 mb-2'
            }, 'Category'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, recipe.category)
          ]),
          recipe.author && React.createElement('div', {
            key: 'author'
          }, [
            React.createElement('h3', {
              key: 'label',
              className: 'text-lg font-semibold text-gray-900 mb-2'
            }, 'Author'),
            React.createElement('p', {
              key: 'value',
              className: 'text-gray-600'
            }, recipe.author)
          ])
        ]),
        
        React.createElement('div', {
          key: 'ingredients'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-xl font-semibold text-gray-900 mb-4'
          }, 'Ingredients'),
          React.createElement('div', {
            key: 'list',
            className: 'grid md:grid-cols-2 gap-2'
          }, recipe.ingredients.map((ingredient, index) => 
            React.createElement('div', {
              key: index,
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('span', {
                key: 'bullet',
                className: 'text-blue-600'
              }, '•'),
              React.createElement('span', {
                key: 'name',
                className: 'text-gray-700 capitalize'
              }, ingredient)
            ])
          ))
        ])
      ])
    ])
  ]);
};

// Recipe Index Component
const RecipeIndex = ({ onViewRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const recipesPerPage = 12;

  useEffect(() => {
    loadRecipes(currentPage);
  }, [currentPage]);

  const loadRecipes = (page) => {
    setLoading(true);
    const offset = page * recipesPerPage;
    fetch(`/api/v1/recipes?limit=${recipesPerPage}&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes || []);
        setTotalRecipes(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setLoading(false);
      });
  };

  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  if (loading) {
    return React.createElement('div', {
      className: 'text-center py-8'
    }, React.createElement('div', {
      className: 'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
    }));
  }

  return React.createElement('div', null, [
    React.createElement('div', {
      key: 'header',
      className: 'flex justify-between items-center mb-6'
    }, [
      React.createElement('h2', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'All Recipes'),
      React.createElement('p', {
        key: 'count',
        className: 'text-gray-600'
      }, `${totalRecipes} recipes total`)
    ]),
    
    React.createElement('div', {
      key: 'recipes',
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
    }, recipes.map(recipe => React.createElement(RecipeCard, {
      key: recipe.id,
      recipe,
      onViewRecipe
    }))),
    
    // Pagination
    totalPages > 1 && React.createElement('div', {
      key: 'pagination',
      className: 'flex justify-center items-center space-x-2'
    }, [
      React.createElement('button', {
        key: 'prev',
        onClick: () => setCurrentPage(Math.max(0, currentPage - 1)),
        disabled: currentPage === 0,
        className: `px-4 py-2 rounded-lg ${currentPage === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`
      }, 'Previous'),
      React.createElement('span', {
        key: 'info',
        className: 'px-4 py-2 text-gray-700'
      }, `Page ${currentPage + 1} of ${totalPages}`),
      React.createElement('button', {
        key: 'next',
        onClick: () => setCurrentPage(Math.min(totalPages - 1, currentPage + 1)),
        disabled: currentPage >= totalPages - 1,
        className: `px-4 py-2 rounded-lg ${currentPage >= totalPages - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`
      }, 'Next')
    ])
  ]);
};

// Ingredient Input Component
const IngredientInput = ({ ingredients, setIngredients, onSearch }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentInput.length > 1) {
      setLoading(true);
      fetch(`/api/v1/ingredients?q=${encodeURIComponent(currentInput)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.ingredients || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching ingredients:', err);
          setLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [currentInput]);

  const addIngredient = (ingredient) => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
      setCurrentInput('');
      setSuggestions([]);
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      addIngredient(currentInput.trim());
    }
  };

  return React.createElement('div', {
    className: 'bg-white rounded-lg shadow p-6 mb-6'
  }, [
    React.createElement('h2', {
      key: 'title',
      className: 'text-xl font-bold mb-4 text-gray-900'
    }, 'What ingredients do you have?'),
    
    React.createElement('div', {
      key: 'input-container',
      className: 'relative'
    }, [
      React.createElement('input', {
        key: 'input',
        type: 'text',
        value: currentInput,
        onChange: (e) => setCurrentInput(e.target.value),
        onKeyPress: handleKeyPress,
        placeholder: 'Type an ingredient (e.g., chicken, tomato, rice)...',
        className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      }),
      
      // Suggestions dropdown
      suggestions.length > 0 && React.createElement('div', {
        key: 'suggestions',
        className: 'absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg'
      }, suggestions.map((suggestion, index) => 
        React.createElement('div', {
          key: index,
          className: 'px-4 py-2 hover:bg-gray-100 cursor-pointer',
          onClick: () => addIngredient(suggestion)
        }, suggestion)
      ))
    ]),
    
    // Selected ingredients
    ingredients.length > 0 && React.createElement('div', {
      key: 'selected',
      className: 'mt-4'
    }, [
      React.createElement('p', {
        key: 'label',
        className: 'text-sm font-medium text-gray-700 mb-2'
      }, 'Selected ingredients:'),
      React.createElement('div', {
        key: 'tags',
        className: 'flex flex-wrap gap-2 mb-4'
      }, ingredients.map((ingredient, index) => 
        React.createElement('span', {
          key: index,
          className: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center'
        }, [
          React.createElement('span', { key: 'text' }, ingredient),
          React.createElement('button', {
            key: 'remove',
            onClick: () => removeIngredient(ingredient),
            className: 'ml-2 text-green-600 hover:text-green-800'
          }, '×')
        ])
      )),
      React.createElement('button', {
        key: 'search',
        onClick: onSearch,
        className: 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
      }, 'Find Recipes')
    ])
  ]);
};

// Recipe Search Component
const RecipeSearch = ({ onViewRecipe }) => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchRecipes = () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    setHasSearched(true);
    
    fetch(`/api/v1/recipes/search?ingredients=${ingredients.join(',')}`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching recipes:', err);
        setLoading(false);
      });
  };

  return React.createElement('div', null, [
    React.createElement(IngredientInput, {
      key: 'input',
      ingredients,
      setIngredients,
      onSearch: searchRecipes
    }),
    
    loading && React.createElement('div', {
      key: 'loading',
      className: 'text-center py-8'
    }, React.createElement('div', {
      className: 'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
    })),
    
    !loading && hasSearched && React.createElement('div', {
      key: 'results'
    }, [
      React.createElement('h2', {
        key: 'results-title',
        className: 'text-2xl font-bold mb-4 text-gray-900'
      }, recipes.length > 0 ? 
        `Found ${recipes.length} recipe${recipes.length === 1 ? '' : 's'}` : 
        'No recipes found'
      ),
      
      recipes.length > 0 ? React.createElement('div', {
        key: 'recipe-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }, recipes.map(recipe => React.createElement(RecipeCard, {
        key: recipe.id,
        recipe,
        onViewRecipe
      }))) : hasSearched && React.createElement('div', {
        key: 'no-results',
        className: 'text-center py-8 text-gray-600'
      }, 'Try different ingredients or check your spelling.')
    ])
  ]);
};

// Recipe Create Component
const RecipeCreate = ({ onRecipeCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    cook_time: '',
    prep_time: '',
    cuisine: '',
    category: '',
    image_url: ''
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load all ingredients for the dropdown
    setLoading(true);
    fetch('/api/v1/ingredients?with_ids=true&limit=1000')
      .then(res => res.json())
      .then(data => {
        setAvailableIngredients(data.ingredients || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching ingredients:', err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.some(ing => ing.id === ingredient.id);
      if (isSelected) {
        return prev.filter(ing => ing.id !== ingredient.id);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.cook_time || !formData.prep_time) {
      setMessage('Please fill in all required fields');
      return;
    }

    setSubmitLoading(true);
    setMessage('');

    const payload = {
      recipe: {
        title: formData.title,
        cook_time: parseInt(formData.cook_time),
        prep_time: parseInt(formData.prep_time),
        cuisine: formData.cuisine,
        category: formData.category,
        image_url: formData.image_url
      },
      ingredient_ids: selectedIngredients.map(ing => ing.id)
    };

    fetch('/api/v1/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.recipe) {
          setMessage('Recipe created successfully!');
          // Reset form
          setFormData({
            title: '',
            cook_time: '',
            prep_time: '',
            cuisine: '',
            category: '',
            image_url: ''
          });
          setSelectedIngredients([]);
          if (onRecipeCreated) onRecipeCreated(data.recipe);
        } else {
          setMessage(data.errors ? data.errors.join(', ') : 'Error creating recipe');
        }
        setSubmitLoading(false);
      })
      .catch(err => {
        console.error('Error creating recipe:', err);
        setMessage('Error creating recipe');
        setSubmitLoading(false);
      });
  };

  if (loading) {
    return React.createElement('div', {
      className: 'text-center py-8'
    }, React.createElement('div', {
      className: 'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
    }));
  }

  return React.createElement('div', {
    className: 'max-w-4xl mx-auto'
  }, [
    React.createElement('h2', {
      key: 'title',
      className: 'text-3xl font-bold text-gray-900 mb-6'
    }, 'Create New Recipe'),

    message && React.createElement('div', {
      key: 'message',
      className: `mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
    }, message),

    React.createElement('form', {
      key: 'form',
      onSubmit: handleSubmit,
      className: 'bg-white rounded-lg shadow-lg p-6'
    }, [
      React.createElement('div', {
        key: 'form-grid',
        className: 'grid md:grid-cols-2 gap-6 mb-6'
      }, [
        React.createElement('div', {
          key: 'title-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Title *'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: formData.title,
            onChange: (e) => handleInputChange('title', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            required: true
          })
        ]),

        React.createElement('div', {
          key: 'cuisine-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Cuisine'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: formData.cuisine,
            onChange: (e) => handleInputChange('cuisine', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          })
        ]),

        React.createElement('div', {
          key: 'cook-time-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Cook Time (minutes) *'),
          React.createElement('input', {
            key: 'input',
            type: 'number',
            value: formData.cook_time,
            onChange: (e) => handleInputChange('cook_time', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            min: '0',
            required: true
          })
        ]),

        React.createElement('div', {
          key: 'prep-time-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Prep Time (minutes) *'),
          React.createElement('input', {
            key: 'input',
            type: 'number',
            value: formData.prep_time,
            onChange: (e) => handleInputChange('prep_time', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            min: '0',
            required: true
          })
        ]),

        React.createElement('div', {
          key: 'category-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Category'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: formData.category,
            onChange: (e) => handleInputChange('category', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          })
        ]),

        React.createElement('div', {
          key: 'image-field'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Image URL'),
          React.createElement('input', {
            key: 'input',
            type: 'url',
            value: formData.image_url,
            onChange: (e) => handleInputChange('image_url', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          })
        ])
      ]),

      React.createElement('div', {
        key: 'ingredients-section',
        className: 'mb-6'
      }, [
        React.createElement('label', {
          key: 'label',
          className: 'block text-sm font-medium text-gray-700 mb-3'
        }, 'Select Ingredients'),
        
        React.createElement('div', {
          key: 'ingredients-grid',
          className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4'
        }, availableIngredients.map(ingredient => 
          React.createElement('label', {
            key: ingredient.id,
            className: 'flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded'
          }, [
            React.createElement('input', {
              key: 'checkbox',
              type: 'checkbox',
              checked: selectedIngredients.some(ing => ing.id === ingredient.id),
              onChange: () => handleIngredientToggle(ingredient),
              className: 'text-blue-600'
            }),
            React.createElement('span', {
              key: 'name',
              className: 'text-sm capitalize'
            }, ingredient.name)
          ])
        )),

        selectedIngredients.length > 0 && React.createElement('div', {
          key: 'selected-ingredients',
          className: 'mt-4'
        }, [
          React.createElement('p', {
            key: 'label',
            className: 'text-sm font-medium text-gray-700 mb-2'
          }, `Selected: ${selectedIngredients.length} ingredients`),
          React.createElement('div', {
            key: 'tags',
            className: 'flex flex-wrap gap-2'
          }, selectedIngredients.map(ingredient => 
            React.createElement('span', {
              key: ingredient.id,
              className: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
            }, ingredient.name)
          ))
        ])
      ]),

      React.createElement('div', {
        key: 'submit-section',
        className: 'flex justify-end'
      }, React.createElement('button', {
        type: 'submit',
        disabled: submitLoading,
        className: `px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`
      }, submitLoading ? 'Creating...' : 'Create Recipe'))
    ])
  ]);
};

// Main App Component
const RecipeFinderApp = () => {
  const [currentView, setCurrentView] = useState('search');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [previousView, setPreviousView] = useState('search');

  const handleViewRecipe = (recipeId) => {
    setPreviousView(currentView);
    setSelectedRecipeId(recipeId);
    setCurrentView('show');
  };

  const handleBackFromRecipe = () => {
    setSelectedRecipeId(null);
    setCurrentView(previousView);
  };

  const handleRecipeCreated = (recipe) => {
    // Navigate to the newly created recipe
    handleViewRecipe(recipe.id);
  };

  return React.createElement('div', {
    className: 'min-h-screen bg-gray-50'
  }, [
    React.createElement(Navigation, {
      key: 'navigation',
      currentView,
      setCurrentView
    }),
    
    React.createElement('div', {
      key: 'content',
      className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'
    }, [
      currentView === 'search' && React.createElement(RecipeSearch, {
        key: 'search',
        onViewRecipe: handleViewRecipe
      }),
      
      currentView === 'index' && React.createElement(RecipeIndex, {
        key: 'index',
        onViewRecipe: handleViewRecipe
      }),
      
      currentView === 'show' && selectedRecipeId && React.createElement(RecipeShow, {
        key: 'show',
        recipeId: selectedRecipeId,
        onBack: handleBackFromRecipe
      }),
      
      currentView === 'create' && React.createElement(RecipeCreate, {
        key: 'create',
        onRecipeCreated: handleRecipeCreated
      })
    ])
  ]);
};

// Render the app
const container = document.getElementById('recipe-finder-app');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(RecipeFinderApp)); 