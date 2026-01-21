#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Reorganizes the Postman collection with nested folder structure
 * matching the OpenAPI x-tagGroups organization.
 */
const fs = require('fs');
const path = require('path');

const inputFile = path.join(
  __dirname,
  '../public/simcasi.postman_collection.json'
);
const outputFile = inputFile;

// Tag groups from OpenAPI specification with proper naming
const tagGroups = {
  'Identity & Access Management': [
    { key: 'auth', name: 'Authentication' },
    { key: 'users', name: 'Users' },
    { key: 'roles', name: 'Roles' },
    { key: 'permissions', name: 'Permissions' },
    { key: 'sessions', name: 'Sessions' },
  ],
  'Clinical Monitoring': [
    { key: 'patients', name: 'Patients' },
    { key: 'exams', name: 'Exams' },
    { key: 'treatments', name: 'Treatments' },
    { key: 'notifications', name: 'Notifications' },
    { key: 'observations', name: 'Observations' },
  ],
  'Governance & Operations': [
    { key: 'audit-logs', name: 'Audit Logs' },
    { key: 'health', name: 'System' },
  ],
};

function organizeCollection() {
  console.log('📂 Reading Postman collection...');
  const collection = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  console.log('🔄 Reorganizing folders...');

  // Create a map of tag name to folder
  const folderMap = new Map();
  collection.item.forEach((folder) => {
    folderMap.set(folder.name, folder);
  });

  // Create new organized structure
  const newItems = [];

  for (const [groupName, tags] of Object.entries(tagGroups)) {
    const groupFolder = {
      name: groupName,
      description: `${groupName} endpoints`,
      item: [],
    };

    tags.forEach((tag) => {
      const folder = folderMap.get(tag.key);
      if (folder) {
        // Rename folder to proper name
        folder.name = tag.name;
        groupFolder.item.push(folder);
      }
    });

    if (groupFolder.item.length > 0) {
      newItems.push(groupFolder);
    }
  }

  collection.item = newItems;

  console.log('💾 Writing reorganized collection...');
  fs.writeFileSync(outputFile, JSON.stringify(collection, null, 4), 'utf8');

  console.log('✅ Postman collection reorganized successfully!');
  console.log(
    `   - Identity & Access Management (${tagGroups['Identity & Access Management'].length} resources)`
  );
  console.log(
    `   - Clinical Monitoring (${tagGroups['Clinical Monitoring'].length} resources)`
  );
  console.log(
    `   - Governance & Operations (${tagGroups['Governance & Operations'].length} resources)`
  );
}

organizeCollection();
