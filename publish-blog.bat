cd blog
hugo -d ../docs
cd ..
git add ./docs
git commit -m "Blog publish"
git push origin master