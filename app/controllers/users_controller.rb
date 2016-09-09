class UsersController < ApplicationController
  require 'json'
  layout 'auth', only: [:new]

  # GET /register
  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
      format.json {
        render :json => @user.to_json
      }
    end
  end

  # POST /users
  def create
    @user = User.new(get_request_params)

    if @user.save
      render status: 200,
             json: {
               info: "Account created",
               data: {
                 success: true,
                 msg: "Usuário criado com sucesso!"
               }
             }
    else
      render status: 500,
             json: {
               info: "Account not created",
               success: false,
               msg: "E-mail já registrado. Por favor, escolha outro"
             } if unavailable_email?

      render status: 500,
             json: {
               info: "Account not created",
               success: false,
               msg: "Nome de usuário já registrado. Por favor, escolha outro"
             } if unavailable_username?
    end
  end

  private
  def get_request_params
    params.require(:user).permit(:first_name, :last_name, :email, :username, :password)
  end

  def unavailable_email?
    User.exists?(email: @user.email)
  end

  def unavailable_username?
    User.exists?(username: @user.username)
  end
end
