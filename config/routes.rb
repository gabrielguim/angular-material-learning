Rails.application.routes.draw do
  root 'auth#login'

  # Instead of using only rails default REST through :resources, we've created more friendly routes for users and authentication actions
  resources :users
  get 'register' => 'users#new'
  get 'login' => 'auth#login'
  post 'login' => 'auth#authenticate'
  get 'logout' => 'auth#destroy'

  # Additional routes for documents that are not provided by rails default REST (:resources)
  resources :documents
  get 'documents/children/:folder_id' => 'documents#find_children'
  get 'documents/shared/:user_id' => 'documents#find_shared'
  get 'documents/delete/:id' => 'documents#move_to_trash'
  get 'documents/restore/:id' => 'documents#restore_from_trash'
  get 'documents/trash/:user_id' => 'documents#find_user_trash'

  # Routes for folders
  resources :folders, :path => 'my-drive'
  get 'folders/children/:folder_id' => 'folders#find_children'

  # Routes for policies
  resources :policies
  get 'policies/document/:document_id' => 'policies#find_document_policy'

  # Routes for notifications
  resources :notifications
  get 'notifications/user/:user_id' => 'notifications#find_by_user'
end
