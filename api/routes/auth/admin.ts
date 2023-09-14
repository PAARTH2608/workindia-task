import express, { Router, Request, Response } from "express";
import Admin from "../../models/admin";
import { check, validationResult } from "express-validator";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Match, Player, Team } from "../../models";
import checkAuthorization from "../../middleware";
const router = express.Router();

// SIGNUP ADMIN
router.post("/admin/signup", async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
      email,
    });

    const user_id = admin.id;

    res.status(200).json({
      status: "Admin Account successfully created",
      status_code: 200,
      user_id,
    });
  } catch (error) {
    console.error("Error creating admin account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LOGIN ADMIN
router.post(
  "/admin/login",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if an admin with the given username exists
      const admin = await Admin.findOne({ where: { username } });

      if (!admin) {
        return res.status(401).json({
          status: "Incorrect username/password provided. Please retry",
        });
      }

      // Compare the provided password with the stored password hash
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "Incorrect username/password provided. Please retry",
        });
      }

      // If the username and password are correct, generate a JWT token
      const payload = {
        user_id: admin.id,
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY as Secret,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            throw err;
          }

          res.json({
            status: "Login successful",
            status_code: 200,
            user_id: admin.id.toString(),
            access_token: token,
          });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "Internal Server Error" });
    }
  }
);

// CREATE PLAYER
router.post("/admin/create-player", async (req: Request, res: Response) => {
  try {
    const {
      player_id,
      name,
      role,
      matches_played,
      runs,
      average,
      strike_rate,
    } = req.body;

    const player = await Player.create({
      player_id,
      name,
      role,
      matches_played,
      runs,
      average,
      strike_rate,
    });

    res.status(200).json({
      status: "Player successfully created",
      status_code: 200,
      player_id: player.player_id,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE TEAM
router.post("/admin/create-team", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Create a new team
    const team = await Team.create({
      id,
    });

    res.status(201).json({
      status: "Team created successfully",
      status_code: 201,
      team_id: team.id,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ADD PLAYER TO TEAM
router.post("/teams/:team_id/squad", async (req: Request, res: Response) => {
  try {
    const { team_id } = req.params;
    const { name, role } = req.body;

    const team = await Team.findByPk(team_id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const player = await Player.create({
      name,
      role,
    });

    // Add the player to the team's squad
    await team.addPlayer(player);

    res.status(200).json({
      message: "Player added to squad successfully",
      player_id: player.player_id,
    });
  } catch (error) {
    console.error("Error adding player to squad:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET PLAYER STATS
router.get("/players/:player_id/stats", async (req: Request, res: Response) => {
  try {
    const { player_id: playerId } = req.params;

    // Find the player by player_id
    const player = await Player.findOne({
      where: { player_id: playerId },
    });

    if (!player) {
      return res.status(404).json({
        status: "Player not found",
        status_code: 404,
      });
    }

    const { player_id, name, matches_played, runs, average, strike_rate } =
      player;

    res.status(200).json({
      player_id,
      name,
      matches_played,
      runs,
      average,
      strike_rate,
    });
  } catch (error) {
    console.error("Error retrieving player stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE MATCH
router.post("/matches", checkAuthorization, async (req, res) => {
  try {
    // Extract match data from the request body
    const { team_1, team_2, date, venue } = req.body;

    // Create a new match
    const match = await Match.create({
      team_1,
      team_2,
      date,
      venue,
      status: "upcoming",
      squads: {
        team_1: [],
        team_2: [],
      },
    });

    res.status(200).json({
      message: "Match created successfully",
      match_id: match.id,
    });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET MATCHES
router.get("/matches", async (req, res) => {
  try {
    // Fetch all matches from the database
    const matches = await Match.findAll();

    // Map the matches to the desired response format
    const matchesResponse = matches.map(
      (match: {
        id: any;
        team_1: any;
        team_2: any;
        date: any;
        venue: any;
      }) => ({
        match_id: match.id,
        team_1: match.team_1,
        team_2: match.team_2,
        date: match.date,
        venue: match.venue,
      })
    );

    res.status(200).json({ matches: matchesResponse });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET MATCH SCHEDULES
router.get("/matches/:match_id", async (req, res) => {
  try {
    // Extract match_id from the URL parameter
    const { match_id } = req.params;

    // Find the match by match_id and include associated teams and players
    const match = await Match.findByPk(match_id);

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Map the squads to the desired response format
    const team1 = 

    // Prepare the response data
    const matchResponse = {
      match_id: match.id,
      team_1: match.team_1.name,
      team_2: match.team_2.name,
      date: match.date,
      venue: match.venue,
      status: match.status,
      squads: squadsResponse,
    };

    res.status(200).json(matchResponse);
  } catch (error) {
    console.error("Error fetching match by match_id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
