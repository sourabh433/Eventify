const Event = require("../models/Event");

// 📌 Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const filters = {};

    if (req.query.category) filters.category = req.query.category;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.ticketPrice) filters.ticketPrice = req.query.ticketPrice;

      const events = await Event.find(filters);
    // const events = await Event.find(filters).populate("createdBy", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
 
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Create event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
      imageUrl,
    } = req.body;

    // ✅ validation
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !category ||
      !totalSeats ||
      ticketPrice === undefined
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats, // ✅ IMPORTANT FIX
      ticketPrice,
      imageUrl, // ✅ FIXED (was image)
      
      
    });

    res.status(201).json(event);
  } catch (error) {
     
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update event
exports.updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
      imageUrl,
    } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.ticketPrice = ticketPrice ?? event.ticketPrice;
    event.imageUrl = imageUrl || event.imageUrl;

    // ✅ FIX seats logic
    if (totalSeats) {
      const diff = totalSeats - event.totalSeats;
      event.totalSeats = totalSeats;
      event.availableSeats += diff; // adjust seats properly
    }

    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};