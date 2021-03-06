from flask import Blueprint, jsonify, session, request
from app.models import User, db
from app.forms import LoginForm, ChangePasswordForm
from app.forms import SignUpForm, UpdateProfileForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict_for_self()
    return {'errors': ['Unauthorized']}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # print(request.get_json())
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        credential = form.data['credential']
        if '@' in credential:
            user = User.query.filter(User.email == credential).first()
        else:
            user = User.query.filter(User.username == credential).first()
        login_user(user)
        return user.to_dict_for_self()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@auth_routes.route('/changepsw', methods=['POST'])
@login_required
def changepsw():
    """
    Change the loggedin user password
    """
    form = ChangePasswordForm()
    # print(request.get_json())
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        credential = form.data['credential']
        newPassword = form.data['newPassword']

        try:
            if '@' in credential:
                user = User.query.filter(User.email == credential).first()
            else:
                user = User.query.filter(User.username == credential).first()
            user.password = newPassword
            db.session.commit()
            login_user(user)
            return {"success": "password updated successfully"}
        except:
            {"errors": "Could not update password"}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            name=form.data['name'],
            email=form.data['email'],
            password=form.data['password'],
            bio=form.data['bio'],
            websiteUrl=form.data['websiteUrl'],
            profilePicUrl=form.data['profilePicUrl']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict_for_self()
    return {'errors': validation_errors_to_error_messages(form.errors)}


@auth_routes.route('/update', methods=['POST'])
@login_required
def update():
    """
    Creates a new user and logs them in
    """
    form = UpdateProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        username=form.data['username'],
        name=form.data['name'],
        email=form.data['email'],
        bio=form.data['bio'],
        websiteUrl=form.data['websiteUrl'],
        profilePicUrl=form.data['profilePicUrl']

        user = current_user

        if username: user.username = username[0]
        if name: user.name = name[0]
        if email: user.email = email[0]
        if bio: user.bio = bio[0]
        if websiteUrl: user.websiteUrl = websiteUrl[0]
        if profilePicUrl: user.profilePicUrl = profilePicUrl

        db.session.commit()
        return user.to_dict_for_self()
    return {'errors': validation_errors_to_error_messages(form.errors)}


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
