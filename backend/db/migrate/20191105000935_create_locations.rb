class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.string :name
      t.string :address
      t.float :lat
      t.float :lng
      t.float :milesFrom

      t.timestamps
    end
  end
end
