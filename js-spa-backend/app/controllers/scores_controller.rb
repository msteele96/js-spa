class ScoresController < ApplicationController
    def index
        scores = Score.all
        render json: ScoreSerializer.new(scores)
    end

    def show
        score = Score.find(params[:id])
        render json: ScoreSerializer.new(score)
    end

    def create
        user = User.find(params[:user_id])
        score = user.scores.build(value: params[:score])
        score.save
        render json: ScoreSerializer.new(score)
    end

    def high
        scores = Score.all
        sorted = scores.sort_by {|obj| obj.value}
        sorted.reverse!
        top = sorted.slice(0,3)
        render json: ScoreSerializer.new(top)

    end
end
