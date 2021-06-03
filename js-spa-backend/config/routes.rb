Rails.application.routes.draw do
  resources :scores only: [:index, :show, :create]
  resources :users only: [:index, :show, :create]
  get '/highscores', to: 'scores#high'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
