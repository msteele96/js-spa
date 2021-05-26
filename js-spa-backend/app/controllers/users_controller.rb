class UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        render json: UserSerializer.new(user)
    end

    def create
        raise params.inspect
        # user = User.new(name: params[:])

    end

    private

    def user_params
        
    end
end
