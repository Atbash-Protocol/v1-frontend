#!/bin/sh

git filter-branch --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

if [ "$GIT_COMMITTER_EMAIL" = "tlr.nodejs@yahoo.com" ]
then
    cn="drtex0"
    cm="98310792+drtex0@users.noreply.github.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "tlr.nodejs@yahoo.com" ]
then
    an="drtex0"
    am="98310792+drtex0@users.noreply.github.com"
fi

export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'