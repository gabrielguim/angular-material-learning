class AuthController < ApplicationController
  require 'json'

  layout 'api', only: [:authenticate, :destroy]

  # POST /login
  def authenticate
  end

  # GET /login
  def login
  end

  # POST /logout
  def logout
  end
end
