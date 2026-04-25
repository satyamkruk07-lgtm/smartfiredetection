'use server';
/**
 * @fileOverview An AI agent that determines the safest evacuation path in a building
 * based on fire and smoke conditions, and provides a concise explanation of its reasoning.
 *
 * - getAegisPrimePathGuidance - A function that handles the path guidance process.
 * - AegisPrimePathGuidanceInput - The input type for the getAegisPrimePathGuidance function.
 * - AegisPrimePathGuidanceOutput - The return type for the getAegisPrimePathGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RoomSchema = z.object({
  id: z.string().describe('Unique identifier for the room (e.g., "R101").'),
  name: z.string().describe('Human-readable name of the room (e.g., "Lobby", "Room 101").'),
  connections: z.array(z.string()).describe('An array of room IDs directly connected to this room.'),
});
export type Room = z.infer<typeof RoomSchema>;

const AegisPrimePathGuidanceInputSchema = z.object({
  buildingLayout: z.array(RoomSchema).describe('An array describing the layout of the building, where each object represents a room with its ID, name, and connections to other rooms.'),
  fireLocations: z.array(z.string()).describe('An array of room IDs where fire is currently detected.'),
  smokeLocations: z.array(z.string()).describe('An array of room IDs where smoke is currently detected.'),
  startRoomId: z.string().describe('The ID of the room where evacuation needs to start.'),
  exitRoomId: z.string().describe('The ID of the designated safe exit room.'),
});
export type AegisPrimePathGuidanceInput = z.infer<typeof AegisPrimePathGuidanceInputSchema>;

const AegisPrimePathGuidanceOutputSchema = z.object({
  path: z.array(z.string()).describe('An ordered array of room IDs representing the safest evacuation path from the start room to the exit room. Rooms with fire should be avoided at all costs. Rooms with smoke should be avoided if possible.'),
  reasoning: z.string().describe('A concise explanation of why this specific path was chosen, considering fire, smoke, and building layout.'),
});
export type AegisPrimePathGuidanceOutput = z.infer<typeof AegisPrimePathGuidanceOutputSchema>;

export async function getAegisPrimePathGuidance(input: AegisPrimePathGuidanceInput): Promise<AegisPrimePathGuidanceOutput> {
  return aegisPrimePathGuidanceFlow(input);
}

// Define an internal prompt schema that accepts stringified inputs for complex objects
const InternalAegisPrimePathGuidanceInputSchema = z.object({
  formattedBuildingLayout: z.string().describe('A pre-formatted string representation of the building layout for the LLM.'),
  formattedFireLocations: z.string().describe('A pre-formatted string representation of rooms with fire.'),
  formattedSmokeLocations: z.string().describe('A pre-formatted string representation of rooms with smoke.'),
  startRoomId: z.string().describe('The ID of the room where evacuation needs to start.'),
  exitRoomId: z.string().describe('The ID of the designated safe exit room.'),
});


const aegisPrimePathGuidancePrompt = ai.definePrompt({
  name: 'aegisPrimePathGuidancePrompt',
  input: { schema: InternalAegisPrimePathGuidanceInputSchema },
  output: { schema: AegisPrimePathGuidanceOutputSchema },
  prompt: `You are an expert disaster management AI, tasked with calculating the safest evacuation path in a building during a fire emergency.
Your goal is to find the optimal path from a starting room to a designated exit, minimizing exposure to fire and smoke.

Here is the building layout and current hazard information:

Building Layout (Rooms and their connections):
{{{formattedBuildingLayout}}}

Rooms with active fire: {{{formattedFireLocations}}}
Rooms with significant smoke: {{{formattedSmokeLocations}}}

Evacuation Start Room: "{{{startRoomId}}}"
Designated Safe Exit Room: "{{{exitRoomId}}}"

Guidelines for pathfinding:
1.  **Avoid Fire:** Rooms with fire are strictly impassable. Do NOT include them in the path.
2.  **Minimize Smoke Exposure:** Rooms with smoke should be avoided if at all possible. Only use a smoke-filled room if there is absolutely no other viable path to the exit.
3.  **Shortest Safe Path:** Among valid paths, prefer the shortest one.
4.  **Logical Flow:** Ensure the path consists of connected rooms according to the building layout.

Based on the information above, determine the safest evacuation path and provide a clear, concise reasoning for your choice.
The output path must be an array of strings representing room IDs, for example: ["R101", "R102", "ExitA"].`,
});

const aegisPrimePathGuidanceFlow = ai.defineFlow(
  {
    name: 'aegisPrimePathGuidanceFlow',
    inputSchema: AegisPrimePathGuidanceInputSchema,
    outputSchema: AegisPrimePathGuidanceOutputSchema,
  },
  async (input) => {
    // Pre-format the buildingLayout into a readable string for the LLM
    const formattedBuildingLayout = input.buildingLayout
      .map(room => `- Room ID: '${room.id}', Name: '${room.name}', Connections: [${room.connections.map(c => `'${c}'`).join(', ')}]`)
      .join('\n');

    const formattedFireLocations = input.fireLocations.length > 0
      ? `[${input.fireLocations.map(id => `'${id}'`).join(', ')}]`
      : 'None';

    const formattedSmokeLocations = input.smokeLocations.length > 0
      ? `[${input.smokeLocations.map(id => `'${id}'`).join(', ')}]`
      : 'None';

    // Prepare the input for the prompt, including the formatted building layout and hazard locations
    const promptInput = {
      formattedBuildingLayout,
      formattedFireLocations,
      formattedSmokeLocations,
      startRoomId: input.startRoomId,
      exitRoomId: input.exitRoomId,
    };

    const { output } = await aegisPrimePathGuidancePrompt(promptInput);
    return output!;
  }
);
