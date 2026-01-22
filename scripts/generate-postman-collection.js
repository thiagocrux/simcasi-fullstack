#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Post-processing script for Postman collection.
 *
 * Handles:
 * 1. Reorganizing endpoints by category groups
 * 2. Flattening unnecessary folder nesting
 * 3. Adding login script with token persistence
 * 4. Configuring request bodies for dynamic variables
 * 5. Setting up explicit authentication for each endpoint
 */

const fs = require('fs');
const path = require('path');

const collectionPath = path.join(
  __dirname,
  '../public/docs/simcasi.postman_collection.json'
);

// Groups and naming convention from the OpenAPI spec.
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
 *
 * Moves requests up one level if they're in a redundant subfolder.
 */
function flattenResourceFolders(folder) {
  if (!folder.item || folder.item.length === 0) {
    return folder;
  }

  const flattenedItems = [];

  folder.item.forEach((item) => {
    if (item.request) {
      // It's a request, keep it.
      flattenedItems.push(item);
    } else if (item.item && item.item.length > 0) {
      // It's a folder with more items inside - flatten it.
      const flattened = flattenResourceFolders(item);
      flattenedItems.push(...(flattened.item || []));
    } else {
      // Keep as is.
      flattenedItems.push(item);
    }
  });

  return {
    ...folder,
    item: flattenedItems,
  };
}

/**
 * Reorganizes the collection by grouping endpoints according to tagGroups.
 */
function organizeByGroups(collection) {
  console.log('\n🔄 Organizing endpoints by groups...');

  // Build a map to find folders by their original tag key
  const folderMap = new Map();
  if (collection.item) {
    collection.item.forEach((folder) => {
      folderMap.set(folder.name, folder);
    });
  }

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

  console.log(
    `   ✓ Identity & Access Management (${tagGroups['Identity & Access Management'].length} resources)`
  );
  console.log(
    `   ✓ Clinical Monitoring (${tagGroups['Clinical Monitoring'].length} resources)`
  );
  console.log(
    `   ✓ Governance & Operations (${tagGroups['Governance & Operations'].length} resources)`
  );
}

/**
 * Adds test script to Login and Refresh Token endpoints that saves tokens to environment variables.
 */
function addTokenPersistenceScripts(collection) {
  console.log('\n📝 Adding token persistence scripts...');

  const identityFolder = collection.item.find(
    (item) => item.name === 'Identity & Access Management'
  );
  if (!identityFolder) return;

  const authFolder = identityFolder.item.find(
    (item) => item.name === 'Authentication'
  );
  if (!authFolder) return;

  const tokenEndpoints = authFolder.item.filter((item) =>
    ['Login', 'Refresh token'].includes(item.name)
  );

  const persistenceScript = `
if (pm.response.code === 200) {
  const responseBody = pm.response.json();

  // Save tokens to environment variables
  if (responseBody.accessToken) {
    pm.environment.set('accessToken', responseBody.accessToken);
  }
  if (responseBody.refreshToken) {
    pm.environment.set('refreshToken', responseBody.refreshToken);
  }

  console.log('✓ Tokens saved successfully to environment variables');
}
`;

  tokenEndpoints.forEach((endpoint) => {
    if (!endpoint.event) {
      endpoint.event = [];
    }

    // Remove existing script if any
    endpoint.event = endpoint.event.filter((e) => e.listen !== 'test');

    // Add new script
    endpoint.event.push({
      listen: 'test',
      script: {
        exec: persistenceScript.trim().split('\n'),
        type: 'text/javascript',
      },
    });
    console.log(`   ✓ Persistence script added to ${endpoint.name}`);
  });
}

/**
 * Configures request bodies for specific endpoints to use variables.
 */
function configureRequestBodies(collection) {
  console.log('\n📦 Configuring request bodies...');

  function traverse(items) {
    if (!items) return;

    items.forEach((item) => {
      if (
        item.request &&
        item.request.body &&
        item.request.body.mode === 'raw'
      ) {
        // Fix Refresh Token body
        if (item.name === 'Refresh token') {
          try {
            const body = JSON.parse(item.request.body.raw);
            // Ensure schema structure is kept but value is replaced
            if (body.refreshToken !== undefined) {
              body.refreshToken = '{{refreshToken}}';
              item.request.body.raw = JSON.stringify(body, null, 2);
              console.log('   ✓ Injected {{refreshToken}} into request body');
            }
          } catch (e) {
            // Ignore parse errors, maybe it's not JSON
          }
        }
      }

      if (item.item) {
        traverse(item.item);
      }
    });
  }

  traverse(collection.item);
}

/**
 * Configures authentication explicitly for each endpoint by traversing the collection.
 *
 * Rules applied:
 * - Public endpoints (Login, Health Check, Refresh Token) -> No Auth
 * - Protected endpoints -> Bearer {{accessToken}}
 */
function configureAuthentication(collection) {
  console.log('\n🔐 Configuring authentication...');

  // Remove root level auth to prevent inheritance.
  if (collection.auth) {
    delete collection.auth;
    console.log('   ✓ Removed root level authentication');
  }

  const publicEndpoints = ['Login', 'API health status', 'Refresh token'];

  function traverse(items) {
    if (!items) return;

    items.forEach((item) => {
      // If it's a request (endpoint)
      if (item.request) {
        // CASE 1: Public Endpoints (No Auth)
        if (publicEndpoints.includes(item.name)) {
          item.request.auth = null;
        }
        // CASE 2: Protected Endpoints (Default)
        else {
          item.request.auth = {
            type: 'bearer',
            bearer: [
              { key: 'token', value: '{{accessToken}}', type: 'string' },
            ],
          };
        }
      }

      // Recursive traversal for folders
      if (item.item) {
        traverse(item.item);
      }
    });
  }

  traverse(collection.item);
  console.log('   ✓ Applied explicit authentication rules to all endpoints');
}

/**
 * Main function that orchestrates all post-processing steps.
 */
function processCollection() {
  try {
    console.log('📂 Reading Postman collection...');
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

    // Apply all transformations
    organizeByGroups(collection);
    addTokenPersistenceScripts(collection);
    configureRequestBodies(collection);
    configureAuthentication(collection);

    // Save modified collection
    console.log('\n💾 Writing updated collection to file...');
    fs.writeFileSync(
      collectionPath,
      JSON.stringify(collection, null, 2),
      'utf8'
    );

    console.log('\n✅ Postman Collection processed successfully!');
  } catch (error) {
    console.error('\n❌ Error processing Postman Collection:', error.message);
    process.exit(1);
  }
}

processCollection();
