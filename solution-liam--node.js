#r @"FParsec.1.0.1\lib\net40-client\FParsecCS.dll"
#r @"FParsec.1.0.1\lib\net40-client\FParsec.dll"

open FParsec

type Direction = N | E | S | W
type Point = {x:int; y:int}
type Rover = {location:Point; direction:Direction}
type Turn = L | R
type Action =
    | Turn of  Turn
    | M
type Instruction = {rover:Rover; actions:Action list}
type Initialization = { upperRight: Point; instructions: Instruction list}

let pdirection = (charReturn 'N' N) <|> (charReturn 'E' E) <|> (charReturn 'S' S) <|> (charReturn 'W' W)
let ptopright = sepBy pint32 (pchar ' ') |>> (fun [x;y] -> {x=x;y=y})

// 1 2 N
let proverstate =
    pipe3
        (pint32 .>> (pchar ' '))
        (pint32 .>> (pchar ' '))
        pdirection
        (fun x y direction -> {location = {x=x;y=y}; direction = direction})

let pturn = (charReturn 'L' (Turn L)) <|> (charReturn 'R' (Turn R))
let pactions = (many (pturn <|> (charReturn 'M' M))) .>> (skipChar '\n' <|> preturn ())

// 1 2 N
// LMLMLMLMM
let pinstruction =
    pipe2
        (proverstate .>> newline)
        pactions
        (fun state actions -> {rover=state; actions=actions})

let pinit =
    pipe2
        (ptopright .>> newline)
        (many pinstruction)
        (fun topright instructions ->
            {upperRight = topright; instructions = instructions})

let testInput = "5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM"

let extectedOutput = "1 3 N
5 1 E"

let play (init:Initialization) =
    let playInstruction (instruction:Instruction) =
        let turn direction action =
            match (direction,action) with
                | (N,L) -> W
                | (N,R) -> E
                | (E,L) -> N
                | (E,R) -> S
                | (S,L) -> E
                | (S,R) -> W
                | (W,L) -> S
                | (W,R) -> N

        let applyAction (rover:Rover) = function
                | Turn t -> {rover with direction = turn rover.direction t}
                | M ->
                    let moved =
                        { rover with location = match rover.direction with
                                                | N -> {rover.location with y = rover.location.y+1}
                                                | E -> {rover.location with x = rover.location.x+1}
                                                | S -> {rover.location with y = rover.location.y-1}
                                                | W -> {rover.location with x = rover.location.x-1}
                        }
                    if moved.location.x < 0
                        || moved.location.y < 0
                        || moved.location.x > init.upperRight.x
                        || moved.location.y > init.upperRight.y then
                        rover
                    else
                        moved
        List.fold applyAction instruction.rover instruction.actions
    List.map playInstruction init.instructions

match run pinit testInput with
    | Success(result, _, _)   -> play result
    | Failure(errorMsg, _, _) -> printfn "Failed to parse: %s" errorMsg; []
