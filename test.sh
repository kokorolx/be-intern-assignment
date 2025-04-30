#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
LIKES_URL="http://localhost:3000/api/likes"
FOLLOWS_URL="http://localhost:3000/api/follows"
FEED_URL="http://localhost:3000/api/feed"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3

    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi

    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# User-related functions
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email

    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email

    local update_data="{"
    local has_data=false

    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi

    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi

    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi

    update_data+="}"

    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

test_get_user_followers() {
    print_header "Testing GET user followers"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (optional): " limit
    read -p "Enter offset (optional): " offset

    local query=""
    if [ -n "$limit" ]; then
        query="?limit=$limit"
        if [ -n "$offset" ]; then
            query+="&offset=$offset"
        fi
    elif [ -n "$offset" ]; then
        query="?offset=$offset"
    fi

    make_request "GET" "$USERS_URL/$user_id/followers$query"
}

test_get_user_activity() {
    print_header "Testing GET user activity"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (optional): " limit
    read -p "Enter offset (optional): " offset
    read -p "Enter type (optional: post, like, follow): " type
    read -p "Enter start date (optional, format YYYY-MM-DD): " startDate
    read -p "Enter end date (optional, format YYYY-MM-DD): " endDate

    local query="?"
    local has_param=false

    if [ -n "$limit" ]; then
        query+="limit=$limit"
        has_param=true
    fi

    if [ -n "$offset" ]; then
        if [ "$has_param" = true ]; then query+="&"; fi
        query+="offset=$offset"
        has_param=true
    fi

    if [ -n "$type" ]; then
        if [ "$has_param" = true ]; then query+="&"; fi
        query+="type=$type"
        has_param=true
    fi

    if [ -n "$startDate" ]; then
        if [ "$has_param" = true ]; then query+="&"; fi
        query+="startDate=$startDate"
        has_param=true
    fi

    if [ -n "$endDate" ]; then
        if [ "$has_param" = true ]; then query+="&"; fi
        query+="endDate=$endDate"
    fi

    make_request "GET" "$USERS_URL/$user_id/activity$query"
}

# Post-related functions
test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter user ID: " userId
    read -p "Enter content: " content

    local post_data=$(cat <<EOF
{
    "userId": "$userId",
    "content": "$content"
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID: " post_id
    read -p "Enter new content: " content

    local post_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$post_id" "$post_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

test_add_hashtag_to_post() {
    print_header "Testing POST add hashtag to post"
    read -p "Enter post ID: " post_id
    read -p "Enter hashtag: " tag

    local tag_data=$(cat <<EOF
{
    "tag": "$tag"
}
EOF
)
    make_request "POST" "$POSTS_URL/$post_id/hashtags" "$tag_data"
}

test_remove_hashtag_from_post() {
    print_header "Testing DELETE remove hashtag from post"
    read -p "Enter post ID: " post_id
    read -p "Enter hashtag: " tag
    make_request "DELETE" "$POSTS_URL/$post_id/hashtags/$tag"
}

test_get_posts_by_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter hashtag: " tag
    read -p "Enter limit (optional): " limit
    read -p "Enter offset (optional): " offset

    local query=""
    if [ -n "$limit" ]; then
        query="?limit=$limit"
        if [ -n "$offset" ]; then
            query+="&offset=$offset"
        fi
    elif [ -n "$offset" ]; then
        query="?offset=$offset"
    fi

    make_request "GET" "$POSTS_URL/hashtag/$tag$query"
}

# Like-related functions
test_create_like() {
    print_header "Testing POST create like"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId

    local like_data=$(cat <<EOF
{
    "userId": "$userId",
    "postId": "$postId"
}
EOF
)
    make_request "POST" "$LIKES_URL" "$like_data"
}

test_delete_like() {
    print_header "Testing DELETE like"
    read -p "Enter like ID: " like_id
    make_request "DELETE" "$LIKES_URL/$like_id"
}

# Follow-related functions
test_create_follow() {
    print_header "Testing POST create follow"
    read -p "Enter follower ID: " followerId
    read -p "Enter following ID: " followingId

    local follow_data=$(cat <<EOF
{
    "followerId": "$followerId",
    "followingId": "$followingId"
}
EOF
)
    make_request "POST" "$FOLLOWS_URL" "$follow_data"
}

test_delete_follow() {
    print_header "Testing DELETE follow"
    read -p "Enter follower ID: " followerId
    read -p "Enter following ID: " followingId

    local follow_data=$(cat <<EOF
{
    "followerId": "$followerId",
    "followingId": "$followingId"
}
EOF
)
    make_request "DELETE" "$FOLLOWS_URL" "$follow_data"
}

# Feed-related functions
test_get_feed() {
    print_header "Testing GET feed"
    read -p "Enter user ID: " userId
    read -p "Enter limit (optional): " limit
    read -p "Enter offset (optional): " offset

    local query="?userId=$userId"
    if [ -n "$limit" ]; then
        query+="&limit=$limit"
    fi
    if [ -n "$offset" ]; then
        query+="&offset=$offset"
    fi

    make_request "GET" "$FEED_URL$query"
}

# Submenu functions
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Get user followers"
    echo "7. Get user activity"
    echo "8. Back to main menu"
    echo -n "Enter your choice (1-8): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Add hashtag to post"
    echo "7. Remove hashtag from post"
    echo "8. Get posts by hashtag"
    echo "9. Back to main menu"
    echo -n "Enter your choice (1-9): "
}

show_likes_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Create like"
    echo "2. Delete like"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

show_follows_menu() {
    echo -e "\n${GREEN}Follows Menu${NC}"
    echo "1. Create follow"
    echo "2. Delete follow"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

# Main menu
show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Posts"
    echo "3. Likes"
    echo "4. Follows"
    echo "5. Feed"
    echo "6. Exit"
    echo -n "Enter your choice (1-6): "
}

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) test_get_user_followers ;;
                    7) test_get_user_activity ;;
                    8) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) test_add_hashtag_to_post ;;
                    7) test_remove_hashtag_from_post ;;
                    8) test_get_posts_by_hashtag ;;
                    9) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_likes_menu
                read like_choice
                case $like_choice in
                    1) test_create_like ;;
                    2) test_delete_like ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_follows_menu
                read follow_choice
                case $follow_choice in
                    1) test_create_follow ;;
                    2) test_delete_follow ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        5) test_get_feed ;;
        6) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done