class UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        render json: UserSerializer.new(user)
    end

    def index
        users = User.all
        render json: UserSerializer.new(users)
    end

    def create
        user = User.find_or_create_by(name: params[:name])
        render json: UserSerializer.new(user)
    end

end
