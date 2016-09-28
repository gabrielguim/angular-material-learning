class CreateDocuments < ActiveRecord::Migration[5.0]
  def change
    create_table :documents do |t|
      t.belongs_to :folder
      t.belongs_to :user
      t.string :name
      t.text :content
      t.string :extension
      t.boolean :deleted, default: false
      t.timestamps
    end
  end
end
