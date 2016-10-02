class PoliciesController < ApplicationController
  require 'json'

  def create
    policy = params.require(:policy)
    user_id = User.find_by(email: policy[:user_email]).id;
    document_id = policy[:document_id]
    permission = policy[:permission]

    @policy = Policy.create(user_id: user_id, document_id: document_id, permission: permission)

    if @policy.save
      sender = User.find(session[:current_user_id])
      receiver = User.find(user_id)
      document = Document.find(document_id)
      document_policy = Policy.find_by(document_id: document.id, user_id: receiver.id)
      message = 'Agora você pode ' + translate_policy(document_policy.permission) + ' meu documento "' + document.name + '.' + document.extension + '"'

      share_notification = Notification.create(from_user_id: sender.id, to_user_id: receiver.id, message: message)
      share_notification.save

      render status: 201,
             json: {
               info: "Policy created",
               success: true,
               msg: "Arquivo compartilhado com sucesso :)"
             }
    else
      render status: 200,
             json: {
               info: "Policy not created",
               success: false,
               msg: "O arquvo não pôde ser compartilhado, por favor tente novamente. :("
             }
    end
  end

  def show
    policy = Policy.find(params[:id])

    respond_to do |format|
      format.json {
        render :json => policy.to_json
      }
    end
  end

  def find_document_policy
    policies = Policy.where(document_id: params[:document_id])

    respond_to do |format|
      format.json {
        render :json => policies.to_json
      }
    end
  end

  def update
  end

  def destroy
  end

  def translate_policy(raw_permission)
    if raw_permission == 'rw'
      permission = 'editar'
    else
      permission = 'visualizar'
    end
  end
end
