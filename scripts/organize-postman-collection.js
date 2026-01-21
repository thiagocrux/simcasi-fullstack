#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Reorganizes the Postman collection to group endpoints by category
 * and removes unnecessary folder nesting from the generated output.
 */
const fs = require('fs');
const path = require('path');

const inputFile = path.join(
  __dirname,
  '../public/docs/simcasi.postman_collection.json'
);
const outputFile = inputFile;

// Groups and naming convention from the OpenAPI spec
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

/**
 * Removes unnecessary folder nesting in the collection.
 * Moves requests up one level if they're in a redundant subfolder.
 */
function flattenResourceFolders(folder) {
  if (!folder.item || folder.item.length === 0) {
    return folder;
  }

  const flattenedItems = [];

  folder.item.forEach((item) => {
    if (item.request) {
      // It's a request, keep it
      flattenedItems.push(item);
    } else if (item.item && item.item.length > 0) {
      // It's a folder with more items inside - flatten it
      const flattened = flattenResourceFolders(item);
      flattenedItems.push(...(flattened.item || []));
    } else {
      // Keep as is
      flattenedItems.push(item);
    }
  });

  return {
    ...folder,
    item: flattenedItems,
  };
}

function organizeCollection() {
  console.log('📂 Reading Postman collection...');
  const collection = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  console.log('🔄 Organizing by groups...');

  // Build a map to find folders by their original tag key
  const folderMap = new Map();
  collection.item.forEach((folder) => {
    folderMap.set(folder.name, folder);
  });

  // Rebuild collection structure with group hierarchy
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
        folder.name = tag.name;
        const flattenedFolder = flattenResourceFolders(folder);
        groupFolder.item.push(flattenedFolder);
      }
    });

    if (groupFolder.item.length > 0) {
      newItems.push(groupFolder);
    }
  }

  collection.item = newItems;

  console.log('💾 Writing to file...');
  fs.writeFileSync(outputFile, JSON.stringify(collection, null, 4), 'utf8');

  console.log('✅ Done!');
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
