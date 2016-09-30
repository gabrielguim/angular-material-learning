module AuthHelper
  def new_session(user)
    puts 'Session created!'
    session[:current_user_id] = user.id
    generate_token
  end

  def destroy_session
    puts 'Destroying current session...'
    session[:current_user_id] = nil
    delete_token
    redirect_to :controller => 'auth', :action => 'login'
  end

  def generate_token
    cookies.encrypted[:authentication_token] = {
      value: 'scribe-' + Time.now.to_i.to_s,
      expires: 1.day.from_now
    }
  end

  def delete_token
    cookies.delete :authentication_token
  end
end
