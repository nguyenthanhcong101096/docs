---
sidebar_position: 1
---

# Git Tutorial
## BRANCHES

```
# List all local branches.	
git branch	                  

# List remote and local branches.	
git branch -a	                

# Create a local branch and switch to it.	
git checkout -b branch_name	  

# Switch to an existing branch.	
git checkout branch_name	    

# Push branch to remote.	
git push origin branch_name	  

# Rename current branch.	
git branch -m new_name	      

# Delete a local branch.	
git branch -d branch_name	    

# Delete a remote branch.	
git push origin :branch_name	
```

## LOGS

```
# Show commit history in single lines.	
git log --oneline

# Show commit history for last N commits.	
git log -2

# Show commit history for last N commits with diff.	
git log -p -2

# Show all local file changes in the working tree.	
git diff

# Show changes made to a file.	
git diff myfile

# Show who changed what & when in a file.	
git blame myfile

# Show remote branches and their mapping to local.
git remote show origin
```

## CLEANUP

```
# Delete all untracked files.	
git clean -f	

# Delete all untracked files and directories.	
git clean -df	

# Undo local modifications to all files.	
git checkout -- .

Unstage a file.	
git reset HEAD myfile	
```


## TAGS

```
Get remote tags.	
git pull --tags	

Switch to an existing tag.	
git checkout tag_name	

List all tags.	
git tag

Create a new tag.	
git tag -a tag_name -m "tag message"	

Push all tags to remote repo.	
git push --tags	
```

## STASHES

```
Save changes to a stash.	
git stash save "stash name" && git stash	

List all stashes.	
git stash list

Apply a stash and delete it from stash list.
git stash pop	
```
