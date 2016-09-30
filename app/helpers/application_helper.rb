module ApplicationHelper
  include AuthHelper, DocumentsHelper, FoldersHelper, UsersHelper

  def is_logged_in?
    path = request.path
    controller = path.split('/')[1]

    if session[:current_user_id] and cookies[:authentication_token]
      # caso haja sessao e o usuario tente acessar algo que nao seja seu drive, redirecione-o para o drive dele, a nao ser que o usuario esteja utilizando a funçao de editor do sistema
      redirect_to_drive if path != '/my-drive' unless controller == 'documents'
      return true
    else
      # caso nao haja sessao, redirecione o usuario para a tela de login, contando que ele já não esteja nela (para nao gerar loops de redirecionamento)
      redirect_to_login if path != '/login' && path != '/'
      return false
    end
  end

  def redirect_to_drive
    redirect_to folders_path
  end

  def redirect_to_login
    redirect_to :controller => 'auth', :action => 'login'
  end

  def get_current_user
    @user ||= User.find(session[:current_user_id]) if session[:current_user_id]
  end

  def my_drive
    Folder.find_by(name: DEFAULT_FOLDER_NAME, user: get_current_user)
  end
end
