class CreateScores < ActiveRecord::Migration[6.1]
  def change
    create_table :scores do |t|
      t.integer :value
      t.references :user

      t.timestamps
    end
  end
end
