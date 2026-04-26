#!/usr/bin/env node
import { Command } from 'commander';
import { compileCommand } from './commands/compile.js';
import { doctorCommand } from './commands/doctor.js';
import { initCommand } from './commands/init.js';
import { newCommand } from './commands/new.js';
import { testCommand } from './commands/test.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program
  .name('genai')
  .description('Turn AI apps into local-first Claude Code Skills.')
  .version('0.1.0-pre');

program
  .command('init')
  .description('Bootstrap Genai layout in the current project')
  .option('--with-hooks', 'include .claude/hooks/ skeleton')
  .option('--with-examples', 'include sample recipe under genai-apps/')
  .action(initCommand);

program
  .command('new <skill-id>')
  .description('Create a new genai.recipe.yml skeleton under genai-apps/<skill-id>/')
  .action(newCommand);

program
  .command('compile')
  .description('Compile a recipe into a Claude Code Skill bundle')
  .option('--recipe <path>', 'path to genai.recipe.yml or directory containing it')
  .option('--out <dir>', 'output directory (default: .claude/skills/<id>)')
  .option('--strict', 'treat warnings as errors')
  .action(compileCommand);

program
  .command('validate <skillDirOrRecipe>')
  .description('Validate a generated skill bundle or a recipe')
  .action(validateCommand);

program
  .command('test <skillDir>')
  .description('Run static + contract + structural eval against a skill bundle')
  .action(testCommand);

program
  .command('doctor')
  .description('Check the local environment for Genai prerequisites')
  .action(doctorCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
