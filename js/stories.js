"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star"><i class="fa-star far"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Takes in form values for story submission and creates new Story instance. Prepends new story 
 * to top of story list and hides submission form
 */
async function submitNewStory(evt) {
  evt.preventDefault();
  let author = $("#author-name").val();
  let title = $("#story-title").val();
  let url = $("#story-url").val();
  
  let story = {author, title, url};
  let newStory = await storyList.addStory(currentUser, story);
  
  const $story = generateStoryMarkup(newStory); //need to separate UI?
  $allStoriesList.prepend($story);
  $submitForm.hide();
}

$submitForm.on("submit", submitNewStory);

/* docstring handles clicking on star */

$allStoriesList.on("click", ".star", toggleFavorite);

function toggleFavorite(evt) {
  evt.preventDefault(); // evt = span
  let $storyId = $(evt.target).closest('li').attr('id');
  let toggleStory;

  for (let story of storyList.stories) {
    if (story.storyId === $storyId) {
      toggleStory = story;
    }
  }
  
  !(toggleStory.favorite) 
    ? currentUser.addFavorite(toggleStory) 
    : currentUser.removeFavorite(toggleStory);
}