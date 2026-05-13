---
name: meeting-notes-to-actions
description: |
  Converts rough meeting notes, transcripts, or voice-memo summaries into structured
  action items, decisions, and follow-ups. Use this skill whenever a user says
  "turn these meeting notes into action items", "extract the todos from this call",
  "summarize this transcript", "who owns what from this meeting?", "write up the
  decisions from our standup", or "clean up these notes". Also activate when a user
  pastes a messy wall of text from a meeting and asks what to do next. Do NOT use
  for scheduling meetings, writing agendas for future meetings, or live transcription.
---

# Meeting Notes to Actions

Transform messy meeting notes and transcripts into clean action items, decisions,
and blockers so every attendee knows what happens next.

## When to Use

- After any meeting where notes were taken (standup, planning, retro, sync, interview)
- Converting a transcript (Otter.ai, Zoom, etc.) into structured output
- Cleaning up a voice memo or bullet-point brain dump from a call

## When NOT to Use

- Planning future meeting agendas
- Live meeting facilitation
- Project planning from scratch (not meeting-based)

---

## Workflow

### Step 1 — Receive Input

Accept any of:

- Raw transcript (speaker-labeled or unlabeled)
- Bullet-point notes
- Voice memo text
- Copy-pasted chat/Slack thread

Ask: "What meeting was this? (date, attendees, topic)" if not obvious from context.

### Step 2 — Extract Key Content

Scan the input and identify:

| Category                  | What to capture                                          |
| ------------------------- | -------------------------------------------------------- |
| **Action items**          | Tasks with a responsible person and (ideally) a deadline |
| **Decisions**             | Choices that were made and ratified                      |
| **Open questions**        | Things discussed but not resolved                        |
| **Blockers**              | Impediments that need to be cleared                      |
| **Key discussion points** | Important context worth preserving                       |

### Step 3 — Structure the Output

Produce the following format:

```markdown
## Meeting Summary — [Topic] | [Date]

**Attendees:** [List]
**Duration:** [If known]

### ✅ Action Items

| Action             | Owner   | Due Date        |
| ------------------ | ------- | --------------- |
| [Task description] | @person | [date or "TBD"] |

### 🔴 Blockers

- [Blocker description] — needs: [who/what]

### ✅ Decisions Made

- [Decision 1]
- [Decision 2]

### ❓ Open Questions

- [Question] — follow up with: @person

### 📝 Key Notes

- [Important context, briefly]
```

### Step 4 — Infer Owners When Not Explicit

If a task was discussed without a clear owner:

- Infer from context ("Alice mentioned she'd look into it" → owner: Alice)
- If truly unclear, set owner to "TBD" and flag it

### Step 5 — Format for Destination

Ask where the output will go:

- **Notion/Confluence:** Use Markdown with headers
- **Slack:** Condensed plain text with emoji bullets
- **Email:** Prose summary + bulleted action items
- **Jira/Linear:** One row per action item ready to copy

---

## Output Format

Default output is Markdown suitable for Notion/Confluence/GitHub.

### Slack-Friendly Compact Version

```
📋 *[Meeting Topic] — [Date]*
*Action Items:*
• [@owner] [task] — due [date]
• [@owner] [task] — due [date]
*Decisions:* [Decision 1] | [Decision 2]
*Blockers:* [Blocker description]
```

---

## Safety & Confirmation

- Do not attribute statements to individuals unless the transcript/notes clearly support it.
- Flag sensitive topics (performance discussions, HR matters) and ask before including them in shared output.
- Mark inferred owners with "(inferred)" so the user can verify.
