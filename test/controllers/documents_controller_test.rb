require 'test_helper'

class DocumentsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get documents_new_url
    assert_response :success
  end

  test "should get create" do
    get documents_create_url
    assert_response :success
  end

  test "should get list" do
    get documents_list_url
    assert_response :success
  end

  test "should get delete" do
    get documents_delete_url
    assert_response :success
  end

  test "should get edit" do
    get documents_edit_url
    assert_response :success
  end

  test "should get update" do
    get documents_update_url
    assert_response :success
  end

end
