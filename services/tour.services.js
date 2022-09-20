const Tour = require("../models/Tour");

// get all tour
exports.getToursService = async (filters, queries) => {
  const tours = await Tour.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const totalCounts = await Tour.countDocuments(filters);
  const totalPages = Math.ceil(totalCounts / queries.limit);
  const currentPage = queries.page;
  const currentPageItems = tours.length;
  return { totalCounts, currentPageItems, totalPages, currentPage, tours };
};

// add new tour
exports.createTourService = async (data) => {
  const tour = await Tour.create(data);
  return tour;
};

// get single tour
exports.getTourByIdService = async (tourId) => {
  const tour = await Tour.findById(tourId);

  //increase the views every time the user hits this route
  tour.view = tour.view + 1;
  await tour.save();
  return tour;
};

// update tour
exports.updateTourByIdService = async (tourId, data) => {

  //update
  const tour = await Tour.updateOne(
    { _id: tourId },
    { $set: data },
    { runValidators: true }
  );
  return tour;
};

// get trending tours
exports.getTrendingToursService = async () => {

  //get top 3 most views tours
  const tours = await Tour.find().sort({ view: -1 }).limit(3);
  return tours;
};

// get cheapest tours
exports.getCheapestToursService = async () => {
  
  //get top 3 cheapest tours
  const tours = await Tour.find().sort({ price: 1 }).limit(3);
  return tours;
};
