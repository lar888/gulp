import SwipeCarousel from './carousel/swipe.js'

const carousel = new SwipeCarousel({
	// slideId: '.item',
	containerId: '.customClass',
	interval: 3000,
	isPlaying: true,
	swipeTreshold: 50
})

carousel.init()