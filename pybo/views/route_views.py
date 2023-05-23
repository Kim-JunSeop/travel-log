# 아래 파이썬 파일은 question 테이블에서 userid와 local(아이디와 위치정보를 가져옴)
# 가져와서 index.html의 맵에 마커를 만들어주는 역할을 하는 백엔드임

# 2023-04-25 첫 작성 완료. 수정되는 대로 계속 주석 알려주세요.
# 230426 signs리스트가져오는 매커니즘 추가(key값 맞추기 위해서)


from flask import Blueprint, jsonify, g, session, request
from pybo.models import db, Question, Signup_Data, Friendship, AddMarker
from pybo.views.main_views import login_required
from werkzeug.utils import secure_filename
import os
from flask import current_app as app


bp = Blueprint('route', __name__, url_prefix='/route')

@bp.route('/get_markers', methods=['GET'])
def get_markers():
    markers = []
    questions = Question.query.all()
    signs= Signup_Data.query.all()

    user_id_to_name={}
    for sign in signs:
        user_id_to_name[sign.id] = sign.id

    for question in questions:
        marker_info = {
            'id' : question.id,
            'subject': question.subject,
            'user_id': user_id_to_name[question.user_id],
            'local': question.local,
            'content': question.content,
            'img_name' : question.img_name
        }
        markers.append(marker_info)

    return jsonify(markers)

@bp.route('/get_friends', methods=['GET'])
@login_required
def get_friends():
    user = g.user
    friends_list = []

    if user is not None:
        # 현재 로그인한 사용자와 친구 관계인 사용자들의 user_id를 얻습니다.
        friend_user_ids = [friendship.user2_id for friendship in Friendship.query.filter_by(user1_id=user.id).all()]

        for friend_user_id in friend_user_ids:
            friend = Signup_Data.query.get(friend_user_id)
            friend_data = {
                "user_id": friend.id,
                "user_name": friend.user_name,
            }
            friends_list.append(friend_data)

    return jsonify(friends_list)

@bp.route('/get_my_id', methods=['GET'])
@login_required
def get_my_id():
    user = g.user
    return jsonify(user.id)

@bp.route('/add_marker', methods=['POST'])
@login_required
def add_marker():
    data = request.form

    image = request.files.get('img_name')
    image_path = None

    local_str = ','.join(map(str, (data.get('latitude'), data.get('longitude'))))
    existing_marker = AddMarker.query.filter_by(local=local_str, user_id=data.get('user_id')).first()
    if existing_marker:
        # If it does, delete it but store its img_name
        old_image_name = existing_marker.img_name
        db.session.delete(existing_marker)
    else:
        old_image_name = None

    if image:
        # Ensure the filename is secure
        secure_image_name = secure_filename(image.filename)
        # Construct the new filename
        new_image_name = secure_image_name.rsplit('.', 1)[0] + '_' + str(data.get('user_id')) + '.' + secure_image_name.rsplit('.', 1)[1]
        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'static', 'image', 'marker2_images', new_image_name)
        # Save the image
        image.save(image_path)
    else:
        # Use the existing image
        new_image_name = old_image_name

    marker2 = AddMarker(
        user_id=data.get('user_id'),
        local=local_str,  # Store latitude and longitude as a string
        subject=data.get('title'),
        content=data.get('content'),
        img_name=new_image_name  # Here, store only the filename
    )

    db.session.add(marker2)
    db.session.commit()

    return {'message': 'New marker added successfully'}, 201




@bp.route('/get_markers2', methods=['GET'])
@login_required
def get_added_markers():
    markers = AddMarker.query.all()
    markers_data = [{'id': marker.id,
                     'user_id': marker.user_id,
                     'local': marker.local,
                     'subject': marker.subject,
                     'content': marker.content,
                     'img_name': marker.img_name} for marker in markers]
    return jsonify(markers_data)