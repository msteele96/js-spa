class ScoreSerializer
  include FastJsonapi::ObjectSerializer
  attributes :value
  belongs_to :user
  attribute :user do |object|
    object.user.as_json
  end
end
