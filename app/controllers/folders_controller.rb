class FoldersController < ApplicationController
  require 'json'
  before_action :is_logged_in?, only: [:index]
  layout 'drive', only: [:index]

  def format_js?
    request.format.js?
  end

  def index
  end

  def new
  end

  def show
    @folder = Folder.find(params[:id])
    respond_to do |format|
      format.html
      format.json {
        render :json => @folder.to_json
      }
    end
  end

  def find_children
    @folders = Folder.where(parent_folder_id: params[:folder_id])
    respond_to do |format|
      format.html
      format.json {
        render :json => @folders.to_json
      }
    end
  end

  def create
    @folder = Folder.new(get_request_params)
    if @folder.save
      render status: 201,
             json: {
               info: "Folder created",
               success: true,
               msg: "Sua pasta foi criada com sucesso! :)"
             }
     end
  end

  def edit
  end

  def update
    @folder = Folder.find(params[:id])
    if @folder.update(get_request_params)
      render status: 200,
             json: {
               info: "Folder updated",
               success: true,
               msg: "Sua pasta foi atualizada com sucesso! :)"
             }
    else
      render status: 200,
             json: {
               info: "Folder not updated",
               success: false,
               msg: "Houve algum problema ao atualizar sua pasta. Tente novamente. :("
             }
    end
  end

  def delete
  end

  private
  def get_request_params
    params.require(:folder).permit(:name, :parent_folder_id, :user_id)
  end
end
