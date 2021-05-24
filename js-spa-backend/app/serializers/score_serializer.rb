class ScoreSerializer
  include FastJsonapi::ObjectSerializer
  attributes :value
  belongs_to :user
end
