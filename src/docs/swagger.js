import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ToolNext API',
      version: '1.0.0',
      description: 'Backend API for ToolNext project',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'API server',
      },
    ],
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Tools' },
      { name: 'Bookings' },
      { name: 'Categories' },
      { name: 'Feedbacks' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },

      schemas: {
        ObjectId: { type: 'string', example: '67936b8878b3aabfebe6148b' },

        BookedRange: {
          type: 'object',
          additionalProperties: false,
          required: ['startDate', 'endDate'],
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            bookedBy: { $ref: '#/components/schemas/ObjectId' },
            bookingId: { $ref: '#/components/schemas/ObjectId' },
          },
        },

        Tool: {
          type: 'object',
          additionalProperties: false,
          required: [
            '_id',
            'owner',
            'category',
            'name',
            'description',
            'pricePerDay',
            'images',
            'imagePublicId',
            'rentalTerms',
            'bookedDates',
            'feedbacks',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            owner: { $ref: '#/components/schemas/ObjectId' },
            category: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', minLength: 3, maxLength: 96 },
            description: { type: 'string' },
            pricePerDay: { type: 'number', example: 120 },
            images: { type: 'string', default: '', example: 'https://...' },
            imagePublicId: {
              type: 'string',
              default: '',
              example: 'cloudinary_public_id',
            },
            rating: { type: 'number', nullable: true, example: 4.7 },
            specifications: {
              type: 'object',
              additionalProperties: { type: 'string' },
              default: {},
              example: { power: '1200W', weight: '2.3kg' },
            },
            rentalTerms: { type: 'string' },
            bookedDates: {
              type: 'array',
              items: { $ref: '#/components/schemas/BookedRange' },
              default: [],
            },
            feedbacks: {
              type: 'array',
              items: { $ref: '#/components/schemas/ObjectId' },
              default: [],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        ToolCreateInput: {
          type: 'object',
          additionalProperties: false,
          required: [
            'category',
            'name',
            'description',
            'pricePerDay',
            'rentalTerms',
          ],
          properties: {
            category: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', minLength: 3, maxLength: 96 },
            description: { type: 'string' },
            pricePerDay: { type: 'number' },
            rentalTerms: { type: 'string' },
            specifications: {
              type: 'object',
              additionalProperties: { type: 'string' },
              default: {},
            },
          },
        },

        ToolUpdateInput: {
          type: 'object',
          additionalProperties: false,
          properties: {
            category: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', minLength: 3, maxLength: 96 },
            description: { type: 'string' },
            pricePerDay: { type: 'number' },
            rentalTerms: { type: 'string' },
            specifications: {
              type: 'object',
              additionalProperties: { type: 'string' },
            },
          },
        },

        ToolsListResponse: {
          type: 'object',
          additionalProperties: false,
          required: ['data', 'page', 'perPage', 'totalItems', 'totalPages'],
          properties: {
            tools: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tool' },
            },
            page: { type: 'integer', minimum: 1, example: 1 },
            perPage: { type: 'integer', minimum: 1, example: 10 },
            totalItems: { type: 'integer', minimum: 0, example: 57 },
            totalPages: { type: 'integer', minimum: 0, example: 6 },
          },
        },

        User: {
          type: 'object',
          additionalProperties: false,
          required: [
            '_id',
            'email',
            'name',
            'avatarUrl',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            email: { type: 'string', example: 'dev@email.com' },
            name: { type: 'string', example: 'Dev' },
            avatarUrl: {
              type: 'string',
              example:
                'https://ac.goit.global/fullstack/react/default-avatar.jpg',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        UserUpdateInput: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 64 },
            // avatarUrl: { type: 'string' },
            // email: { type: 'string' },
          },
        },

        ToolPreview: {
          type: 'object',
          additionalProperties: false,
          required: ['_id', 'name', 'images', 'pricePerDay'],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string' },
            images: { type: 'string' },
            pricePerDay: { type: 'number' },
          },
        },

        UserPreview: {
          type: 'object',
          additionalProperties: false,
          required: ['_id', 'name'],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },

        Booking: {
          type: 'object',
          additionalProperties: false,
          required: [
            '_id',
            'userId',
            'toolId',
            'firstName',
            'lastName',
            'phone',
            'deliveryCity',
            'deliveryBranch',
            'startDate',
            'endDate',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            userId: { $ref: '#/components/schemas/ObjectId' },
            toolId: { $ref: '#/components/schemas/ObjectId' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            deliveryCity: { type: 'string' },
            deliveryBranch: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        BookingPopulated: {
          allOf: [
            { $ref: '#/components/schemas/Booking' },
            {
              type: 'object',
              properties: {
                toolId: { $ref: '#/components/schemas/ToolPreview' },
                userId: { $ref: '#/components/schemas/UserPreview' },
              },
            },
          ],
        },

        BookingCreateInput: {
          type: 'object',
          additionalProperties: false,
          required: [
            'toolId',
            'firstName',
            'lastName',
            'phone',
            'deliveryCity',
            'deliveryBranch',
            'startDate',
            'endDate',
          ],
          properties: {
            toolId: { $ref: '#/components/schemas/ObjectId' },
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            phone: { type: 'string' },
            deliveryCity: { type: 'string' },
            deliveryBranch: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },

        BookingsListResponse: {
          type: 'object',
          additionalProperties: false,
          required: ['bookings', 'page', 'perPage', 'totalItems', 'totalPages'],
          properties: {
            page: { type: 'integer', minimum: 1, example: 1 },
            perPage: { type: 'integer', minimum: 1, example: 10 },
            totalItems: { type: 'integer', minimum: 0, example: 24 },
            totalPages: { type: 'integer', minimum: 0, example: 3 },
            bookings: {
              type: 'array',
              items: { $ref: '#/components/schemas/BookingPopulated' },
            },
          },
        },

        Feedback: {
          type: 'object',
          additionalProperties: false,
          required: [
            '_id',
            'toolId',
            'userId',
            'name',
            'description',
            'rate',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            toolId: { $ref: '#/components/schemas/ObjectId' },

            userId: { $ref: '#/components/schemas/ObjectId' },

            name: { type: 'string' },
            description: { type: 'string' },
            rate: { type: 'number', minimum: 1, maximum: 5, example: 5 },

            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        FeedbackUserPreview: {
          type: 'object',
          additionalProperties: false,
          required: ['_id', 'name', 'avatarUrl'],
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string' },
            avatarUrl: { type: 'string' },
          },
        },

        FeedbackPopulated: {
          allOf: [
            { $ref: '#/components/schemas/Feedback' },
            {
              type: 'object',
              properties: {
                userId: { $ref: '#/components/schemas/FeedbackUserPreview' },
              },
            },
          ],
        },

        FeedbackCreateInput: {
          type: 'object',
          additionalProperties: false,
          required: ['toolId', 'name', 'description', 'rate'],
          properties: {
            toolId: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', minLength: 1, maxLength: 64 },
            description: { type: 'string', minLength: 1, maxLength: 2000 },
            rate: { type: 'number', minimum: 1, maximum: 5 },
          },
        },

        FeedbacksListResponsePaginated: {
          type: 'object',
          additionalProperties: false,
          required: [
            'feedbacks',
            'page',
            'perPage',
            'totalItems',
            'totalPages',
          ],
          properties: {
            page: { type: 'integer', minimum: 1, example: 1 },
            perPage: { type: 'integer', minimum: 1, example: 10 },
            totalItems: { type: 'integer', minimum: 0, example: 24 },
            totalPages: { type: 'integer', minimum: 0, example: 3 },
            feedbacks: {
              type: 'array',
              items: { $ref: '#/components/schemas/FeedbackPopulated' },
            },
          },
        },

        FeedbacksListResponseLimited: {
          type: 'object',
          additionalProperties: false,
          required: ['totalItems', 'feedbacks'],
          properties: {
            totalItems: { type: 'integer', minimum: 0, example: 3 },
            feedbacks: {
              type: 'array',
              items: { $ref: '#/components/schemas/FeedbackPopulated' },
            },
          },
        },

        ErrorResponse: {
          type: 'object',
          additionalProperties: false,
          required: ['message'],
          properties: {
            message: { type: 'string' },
          },
        },
      },

      responses: {
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        NotFound: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
