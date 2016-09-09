module AuthHelper
  def new_session(user)
    session[:current_user_id] = user.id
  end

  def destroy_session
    puts 'destroying session'
    session[:current_user_id] = nil
    redirect_to :controller => 'auth', :action => 'login'
  end
end
