class CreateFolders < ActiveRecord::Migration[5.0]
  def change
    create_table :folders do |t|
      t.belongs_to :parent_folder
      t.belongs_to :user
      t.string :name
      t.timestamps
    end
  end
end
