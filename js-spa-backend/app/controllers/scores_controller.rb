class ScoresController < ApplicationController
    def index
        scores = Score.all
        render json: ScoreSerializer.new(scores)
    end

    def show
        score = Score.find(params[:id])
        render json: ScoreSerializer.new(score)
    end

    # def create
    #     trainer = Trainer.find(params[:trainer_id])
    #     pokemon = trainer.pokemons.build({
    #       nickname: Faker::Name.first_name,
    #       species: Faker::Games::Pokemon.name
    #     })
    #     render json: pokemon.save ? pokemon : {message: pokemon.errors.messages[:team_max][0]}
    # end

    def high
        scores = Score.all
        sorted = scores.sort_by {|obj| obj.value}
        sorted.reverse!
        top = sorted.slice(0,3)
        render json: ScoreSerializer.new(top)

    end
    
    def destroy
        score = Score.find(params[:id])
        score.destroy
    end
end
