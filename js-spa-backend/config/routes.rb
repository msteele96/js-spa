Rails.application.routes.draw do
  resources :scores
  resources :users
  get '/highscores', to: 'scores#high'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
